// hooks/useProductForm.js
import { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductosContext } from '../../ecomerce/context/ProductosContext';

export default function useProductForm(setMainImage, setExtraImages) {
    const { id } = useParams(); // Cambiar a 'id' según la ruta
    const navigate = useNavigate();
    const isEditable = Boolean(id);
    
    // Usar ProductosContext para obtener los datos
    const { 
        productos, 
        loadingProductos,
        getTallesPorSku,
        getImagenPrincipalPorSku,
        getImagenesProductoPorSku,
        solicitarImagenesProducto,
        getEstadoImagenesProducto
    } = useContext(ProductosContext);

    // Estados del formulario
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState([]);
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [sizes, setSizes] = useState([]);

    // Obtener marcas disponibles dinámicamente
    const marcasDisponibles = useMemo(() => {
        if (loadingProductos || productos.length === 0) {
            return ['Nike', 'Vans', 'Jordan']; // Fallback mientras carga
        }
        return [...new Set(productos.map(p => p.marca))].sort();
    }, [productos, loadingProductos]);

    // Cargar datos del producto si estamos editando
    useEffect(() => {
        console.log('useEffect ejecutándose:', { isEditable, id, productosLength: productos.length, loadingProductos });
        
        if (isEditable && !loadingProductos && productos.length > 0 && id) {
            const skuNumber = parseInt(id); // Usar 'id' en lugar de 'sku'
            const productToEdit = productos.find(p => p.sku === skuNumber);
            
            console.log('Buscando producto con SKU:', skuNumber);
            console.log('Producto encontrado:', productToEdit);
            console.log('Todos los productos:', productos);
            
            if (productToEdit) {
                console.log('Producto encontrado para editar:', productToEdit);
                
                // Mapear datos básicos del producto
                setModel(productToEdit.modelo);
                setBrand(productToEdit.marca);
                setColors([productToEdit.color]);
                setPrice(productToEdit.precio.toString());
                
                // Obtener talles con stock del ProductosContext
                const tallesProducto = getTallesPorSku(productToEdit.sku);
                console.log('Talles del producto:', tallesProducto);
                
                if (tallesProducto && tallesProducto.length > 0) {
                    const sizesFormateados = tallesProducto.map(talleData => ({
                        size: talleData.talle.numero.toString(),
                        stock: talleData.stock
                    }));
                    setSizes(sizesFormateados);
                    
                    // Calcular stock total
                    const stockTotal = tallesProducto.reduce((total, talleData) => total + talleData.stock, 0);
                    setStock(stockTotal.toString());
                }
                
                // Obtener imagen principal
                const imagenPrincipal = getImagenPrincipalPorSku(productToEdit.sku);
                console.log('Imagen principal:', imagenPrincipal);
                
                if (imagenPrincipal && imagenPrincipal.cloudinarySecureUrl) {
                    setMainImage(imagenPrincipal.cloudinarySecureUrl);
                }
                
                // Solicitar imágenes adicionales del producto
                solicitarImagenesProducto(productToEdit.sku);
            } else {
                console.log('No se encontró el producto con SKU:', skuNumber);
            }
        }
    }, [id, productos, loadingProductos, isEditable, getTallesPorSku, getImagenPrincipalPorSku, solicitarImagenesProducto, setMainImage]);

    // Cargar imágenes adicionales cuando estén disponibles
    useEffect(() => {
        if (isEditable && id && !loadingProductos) {
            const skuNumber = parseInt(id);
            const estadoImagenes = getEstadoImagenesProducto(skuNumber);
            
            console.log('Estado imágenes para SKU', skuNumber, ':', estadoImagenes);
            
            if (estadoImagenes === 'cargado') {
                const todasLasImagenes = getImagenesProductoPorSku(skuNumber);
                console.log('Todas las imágenes:', todasLasImagenes);
                
                // Filtrar imágenes que no sean la principal y tomar máximo 3
                const imagenesAdicionales = todasLasImagenes
                    .filter(img => !img.esPrincipal)
                    .slice(0, 3)
                    .map(img => img.cloudinarySecureUrl);
                
                // Completar con null si hay menos de 3 imágenes
                while (imagenesAdicionales.length < 3) {
                    imagenesAdicionales.push(null);
                }
                
                console.log('Imágenes adicionales cargadas:', imagenesAdicionales);
                setExtraImages(imagenesAdicionales);
            }
        }
    }, [id, isEditable, loadingProductos, getImagenesProductoPorSku, getEstadoImagenesProducto, setExtraImages]);

    const handleAddProduct = async (mainImage, extraImages) => {
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

            console.log('Creando producto:', newProduct);

            const response = await fetch("http://localhost:8080/sapah/productos", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const addedProduct = await response.json();
            console.log("Producto agregado:", addedProduct);
            
            navigate('/admin');
            
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };

    const handleUpdateProduct = async (mainImage, extraImages) => {
        try {
            const skuNumber = parseInt(id);
            const colorPrincipal = Array.isArray(colors) ? colors[0] : colors;
            
            const updatedProduct = {
                modelo: model,
                marca: brand,
                precio: parseFloat(price),
                color: colorPrincipal,
            };

            console.log('Actualizando producto:', updatedProduct);

            const response = await fetch(`http://localhost:8080/sapah/productos/${skuNumber}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            console.log("Producto actualizado");
            navigate('/admin');
            
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };

    return {
        model, brand, price, stock, sizes, colors,
        setModel, setBrand, setPrice, setStock, setSizes, setColors,
        isEditable,
        loadingProductos,
        marcasDisponibles, // Exponer las marcas disponibles
        handleAddProduct,
        handleUpdateProduct
    };
}
