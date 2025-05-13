import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ProductForm from './ProductForm';
import ConfirmationDialog from './ConfirmationDialog';

export default function NewProduct() {
    const { id } = useParams(); // obtiene el id de la URL
    const isEditable = Boolean(id); // true si estamos editando

    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [extraImages, setExtraImages] = useState([null, null, null]); // máximo 3 extras
    const [sizes, setSizes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:3000/data")
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error al cargar productos", err));
    }, []);

    useEffect(() => {
        if (isEditable && productos.length > 0) {
            console.log("editando producto", id)
            const productToEdit = productos.find(p => p.id === Number(id));
            if (productToEdit) {
                console.log("Producto encontrado:", productToEdit);
                setModel(productToEdit.model);
                setBrand(productToEdit.brand);
                setPrice(productToEdit.price);
                setStock(productToEdit.stock || '');
                setSizes(productToEdit.sizes);
                setMainImage(productToEdit.image[0]);
                setExtraImages(productToEdit.image.slice(1, 4)); // máximo 3 extras
            }
        }
    }, [ id, productos ]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExtraImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...extraImages];
                updated[index] = reader.result;
                setExtraImages(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setMainImage(null);
    };

    // Eliminar imagen extra
    const handleExtraImageRemove = (index) => {
        const updated = [...extraImages];
        updated[index] = null; // Borra la imagen en el índice especificado
        setExtraImages(updated); // Actualiza el estado
    };

    // Creación del nuevo producto
    const handleAddProduct = () => {
        const imageArray = [mainImage, ...extraImages.filter(img => img !== null)];
        const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        const parsePrice = parseInt(price);
        const parseStock = parseInt(stock);

        const newProduct = {
            id: newId,
            model,
            brand,
            price: parsePrice,
            stock: parseStock,
            sizes,
            image: imageArray,
            featured: true,
            new: true
        };

        productos.push(newProduct); // Esto solo vive en memoria
        console.log("Producto agregado al array:", newProduct);

        navigate(`/producto/${newId}`);
    };

    const handleUpdateProduct = () => {
        const updatedProduct = {
            id: Number(id),
            model,
            brand,
            price,
            stock,
            sizes,
            image: [mainImage, ...extraImages.filter(img => img !== null)],
        };

        const index = productos.findIndex(p => p.id === Number(id));
        if (index !== -1) {
            productos[index] = updatedProduct;
            console.log("Producto actualizado:", updatedProduct);
            navigate(`/producto/${id}`);
        } else {
            console.warn("Producto no encontrado para editar.");
        }
    };

    return (
        <Box sx={{ maxWidth: '1300px', margin: '40px auto', px: 2 }}>
            <Typography
                variant="h3"
                sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '30px', mb: 5 }}
                textAlign="center"
            >
                {isEditable ? `Editando: ${model}` : "Crear Nuevo Producto"}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                <ImageUpload
                    mainImage={mainImage}
                    extraImages={extraImages}
                    handleImageUpload={handleImageUpload}
                    handleImageRemove={handleImageRemove}
                    handleExtraImageUpload={handleExtraImageUpload}
                    handleExtraImageRemove={handleExtraImageRemove} // Pasa el handler de eliminación de imagen
                />
                <ProductForm
                    model={model}
                    brand={brand}
                    price={price}
                    stock={stock}
                    sizes={sizes}
                    setModel={setModel}
                    setBrand={setBrand}
                    setPrice={setPrice}
                    setStock={setStock}
                    setSizes={setSizes}
                    onSubmit={() => setDialogOpen(true)}
                    buttonLabel={isEditable ? "Guardar Cambios" : "Agregar Producto"}
                />
            </Box>

            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    setDialogOpen(false); // Cierra el diálogo primero
                    setTimeout(() => {
                        if (isEditable) {
                            handleUpdateProduct();
                        } else {
                            handleAddProduct();
                        }
                    }, 0); // Ejecuta la acción justo después
                }}
                title={isEditable ? "Confirmar actualización" : "Confirmar creación"}
                message={`¿Estás seguro de que deseas ${isEditable ? 'actualizar' : 'crear'} el producto "${model}"?`}
            />
        </Box>
    );
}
