// hooks/useProductForm.js
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductosContext } from '../../ecomerce/context/ProductosContext';
import { AuthContext } from '../../auth/context/AuthContext';

export default function useProductForm(setMainImage, setExtraImages) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditable = Boolean(id);

    // Estados del formulario
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState('');
    const [marcasDisponibles, setMarcasDisponibles] = useState(['Nike', 'Vans', 'Jordan']);

    // Contextos
    const authContext = useContext(AuthContext);
    const authState = authContext?.authState;
    const token = authState?.user?.token;
    const productosContext = useContext(ProductosContext);
    const {
        productos = [],
        loadingProductos = false,
        getTallesPorSku = () => [],
        getImagenPrincipalPorSku = () => null,
        getImagenesProductoPorSku = () => [],
        solicitarImagenesProducto = () => {},
        getEstadoImagenesProducto = () => ({ estado: 'no-cargado' }),
        agregarProductoLocal = () => {},
        actualizarProductoLocal = () => {}
    } = productosContext || {};

    // Estado para talles disponibles
    const [tallesDisponibles, setTallesDisponibles] = useState([]);
    const [loadingTallesDisponibles, setLoadingTallesDisponibles] = useState(false);
    const [errorTallesDisponibles, setErrorTallesDisponibles] = useState(null);

    // Cargar marcas disponibles al montar el componente
    useEffect(() => {
        if (productos && productos.length > 0) {
            const marcasUnicas = [...new Set(productos.map(p => p.marca))].filter(Boolean);
            if (marcasUnicas.length > 0) {
                setMarcasDisponibles(marcasUnicas);
            }
        }
    }, [productos]);

    // Cargar talles disponibles al montar
    useEffect(() => {
        const fetchTalles = async () => {
            setLoadingTallesDisponibles(true);
            setErrorTallesDisponibles(null);
            try {
                const response = await fetch('http://localhost:8080/sapah/talles', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Error al obtener talles');
                const talles = await response.json();
                setTallesDisponibles(talles);
            } catch (err) {
                setErrorTallesDisponibles(err.message);
            } finally {
                setLoadingTallesDisponibles(false);
            }
        };
        if (token) fetchTalles();
    }, [token]);

    // Helper para mapear número de talle a idTalle
    const getIdTalleByNumero = (numero) => {
        const talle = tallesDisponibles.find(t => t.numero.toString() === numero.toString());
        return talle ? talle.idTalle : null;
    };

    // ✅ CORREGIDO: Cargar datos del producto para edición
    useEffect(() => {
        if (isEditable && id && productos.length > 0 && !loadingProductos) {
            const skuNumber = parseInt(id);
            const product = productos.find(p => p.sku === skuNumber);
            
            if (product) {
                // Cargar datos básicos del producto
                setModel(product.modelo || '');
                setBrand(product.marca || '');
                setPrice(product.precio?.toString() || '');
                setColors(product.color || '');
                
                // ✅ CORREGIDO: Cargar talles del producto
                const tallesProducto = getTallesPorSku(skuNumber);
                
                if (tallesProducto && tallesProducto.length > 0) {
                    // Mapear los talles al formato esperado por el formulario
                    const sizesFormateados = tallesProducto.map(talleData => ({
                        size: talleData.talle.numero.toString(),
                        stock: talleData.stock
                    }));
                    
                    setSizes(sizesFormateados);
                    
                    // Calcular stock total
                    const stockTotal = tallesProducto.reduce((total, talleData) => total + talleData.stock, 0);
                    setStock(stockTotal.toString());
                }
                
                // ✅ CORREGIDO: Cargar imagen principal
                const imagenPrincipal = getImagenPrincipalPorSku(skuNumber);
                
                if (imagenPrincipal && imagenPrincipal !== 'ERROR' && imagenPrincipal.cloudinarySecureUrl) {
                    setMainImage(imagenPrincipal.cloudinarySecureUrl);
                }
                
                // ✅ CORREGIDO: Solicitar imágenes adicionales del producto
                solicitarImagenesProducto(skuNumber);
            }
        }
    }, [
        id, 
        isEditable, 
        productos, 
        loadingProductos, 
        getTallesPorSku, 
        getImagenPrincipalPorSku, 
        solicitarImagenesProducto, 
        setMainImage
    ]);

    // ✅ NUEVO: Effect para cargar imágenes adicionales cuando estén disponibles
    useEffect(() => {
        if (isEditable && id && !loadingProductos) {
            const skuNumber = parseInt(id);
            const estadoImagenes = getEstadoImagenesProducto(skuNumber);
            
            // Verificar si las imágenes están cargadas
            if (estadoImagenes === 'cargado') {
                const todasLasImagenes = getImagenesProductoPorSku(skuNumber);
                
                // Filtrar imágenes que no sean la principal
                const imagenesSecundarias = todasLasImagenes
                    .filter(img => !img.esPrincipal)
                    .slice(0, 3) // Máximo 3 imágenes adicionales
                    .map(img => img.cloudinarySecureUrl);
                
                // Completar con null si hay menos de 3 imágenes
                while (imagenesSecundarias.length < 3) {
                    imagenesSecundarias.push(null);
                }
                
                setExtraImages(imagenesSecundarias);
            }
        }
    }, [
        id, 
        isEditable, 
        loadingProductos, 
        getImagenesProductoPorSku, 
        getEstadoImagenesProducto, 
        setExtraImages
    ]);

    const handleAddProduct = async (mainImage, extraImages) => {
        if (!token) {
            alert('Error: No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }
        try {
            const colorPrincipal = Array.isArray(colors) ? colors[0] : colors;
            const newProduct = {
                modelo: model,
                marca: brand,
                precio: parseFloat(price),
                color: colorPrincipal,
                descripcion: "Descripción por defecto",
                destacado: true,
                nuevo: true
            };
            const response = await fetch("http://localhost:8080/sapah/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            const addedProduct = await response.json();
            // Crear talles asociados
            if (sizes && sizes.length > 0) {
                const productoTalles = sizes.map(s => ({
                    producto: { sku: addedProduct.sku },
                    talle: { idTalle: getIdTalleByNumero(s.size) },
                    stock: parseInt(s.stock)
                })).filter(pt => pt.talle.idTalle);
                if (productoTalles.length > 0) {
                    const tallesResp = await fetch('http://localhost:8080/sapah/productos-talles/bulk', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(productoTalles)
                    });
                    if (!tallesResp.ok) {
                        alert('Error al crear talles para el producto.');
                        throw new Error('Error al crear talles');
                    }
                }
            }
            try {
                agregarProductoLocal(addedProduct);
            } catch (error) {
                console.error('Error al actualizar contexto local:', error);
            }
            navigate('/admin');
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert(`Error al crear el producto: ${error.message}`);
        }
    };

    const handleUpdateProduct = async (mainImage, extraImages) => {
        if (!token) {
            alert('Error: No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }
        try {
            const skuNumber = parseInt(id);
            const colorPrincipal = Array.isArray(colors) ? colors[0] : colors;
            const updatedProduct = {
                modelo: model,
                marca: brand,
                precio: parseFloat(price),
                color: colorPrincipal,
            };
            const response = await fetch(`http://localhost:8080/sapah/productos/${skuNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            // Borrar talles existentes
            const tallesActuales = getTallesPorSku(skuNumber);
            for (const pt of tallesActuales) {
                if (pt.idProductoTalle) {
                    await fetch(`http://localhost:8080/sapah/productos-talles/${pt.idProductoTalle}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            }
            // Crear nuevos talles
            if (sizes && sizes.length > 0) {
                const productoTalles = sizes.map(s => ({
                    producto: { sku: skuNumber },
                    talle: { idTalle: getIdTalleByNumero(s.size) },
                    stock: parseInt(s.stock)
                })).filter(pt => pt.talle.idTalle);
                if (productoTalles.length > 0) {
                    const tallesResp = await fetch('http://localhost:8080/sapah/productos-talles/bulk', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(productoTalles)
                    });
                    if (!tallesResp.ok) {
                        alert('Error al crear talles para el producto.');
                        throw new Error('Error al crear talles');
                    }
                }
            }
            try {
                actualizarProductoLocal(skuNumber, updatedProduct);
            } catch (error) {
                console.error('Error al actualizar contexto local:', error);
            }
            navigate('/admin');
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert(`Error al actualizar el producto: ${error.message}`);
        }
    };

    return {
        model, brand, price, stock, sizes, colors,
        setModel, setBrand, setPrice, setStock, setSizes, setColors,
        isEditable,
        marcasDisponibles,
        handleAddProduct,
        handleUpdateProduct,
        tallesDisponibles,
        loadingTallesDisponibles,
        errorTallesDisponibles
    };
}
