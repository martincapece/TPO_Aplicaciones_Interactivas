// hooks/useProductForm.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function useProductForm(setMainImage, setExtraImages) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditable = Boolean(id);

    const [productos, setProductos] = useState([]);
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState([]);
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/data")
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error al cargar productos", err));
    }, []);

    useEffect(() => {
        if (isEditable && productos.length > 0) {
            const productToEdit = productos.find(p => p.id === id);
            if (productToEdit) {
                setModel(productToEdit.model);
                setBrand(productToEdit.brand);
                setColors(productToEdit.colors || []);
                setPrice(productToEdit.price);
                setStock(productToEdit.stock || '');
                setSizes(productToEdit.sizes);
                setMainImage(productToEdit.image[0]);
                setExtraImages(productToEdit.image.slice(1, 4));
            }
        }
    }, [id, productos]);

    const handleAddProduct = (mainImage, extraImages) => {
        const imageArray = [mainImage, ...extraImages.filter(img => img !== null)];
        const newProduct = {
            model,
            brand,
            price: Number(price),
            colors,
            sizes,
            image: imageArray,
            featured: true,
            new: true
        };

        fetch("http://localhost:3000/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        })
            .then(res => res.json())
            .then(addedProduct => {
                console.log("Producto agregado:", addedProduct);
                navigate(`/producto/${addedProduct.id}`);
            })
            .catch(err => console.error("Error al agregar producto:", err));
    };

    const handleUpdateProduct = (mainImage, extraImages) => {
        const updatedProduct = {
            id,
            model,
            brand,
            price,
            colors,
            sizes,
            image: [mainImage, ...extraImages.filter(img => img !== null)],
        };

        fetch(`http://localhost:3000/data/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
        })
            .then(res => res.json())
            .then(() => {
                console.log("Producto actualizado");
                navigate(`/producto/${id}`);
            })
            .catch(err => console.error("Error al actualizar producto:", err));
    };

    return {
        model, brand, price, stock, sizes, colors,
        setModel, setBrand, setPrice, setStock, setSizes, setColors,
        isEditable,
        handleAddProduct,
        handleUpdateProduct
    };
}
