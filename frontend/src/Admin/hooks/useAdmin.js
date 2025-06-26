import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ProductosContext } from '../../ecomerce/context/ProductosContext';
import { AuthContext } from '../../auth/context/AuthContext'; // ✅ AGREGAR

export function useAdmin() {
  const navigate = useNavigate();
  const [productRows, setProductRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // ✅ AGREGAR: Obtener token del contexto de auth
  const { authState } = useContext(AuthContext);
  const token = authState?.user?.token;

  // Usar el contexto de productos
  const { 
    productos, 
    loadingProductos, 
    errorProductos,
    productoTalles,
    imagenesPrincipales,
    getTallesPorSku,
    getImagenPrincipalPorSku,
    // ✅ NUEVAS: Funciones para actualizar datos localmente
    actualizarProductoLocal,
    eliminarProductoLocal
  } = useContext(ProductosContext);

  // Mapear productos de la BD al formato que espera el DataGrid
  useEffect(() => {
    if (productos.length > 0) {
      const mappedProducts = productos.map(producto => {
        const tallesProducto = getTallesPorSku(producto.sku);
        const imagenPrincipal = getImagenPrincipalPorSku(producto.sku);
        
        return {
          id: producto.sku, // Usar SKU como ID
          sku: producto.sku,
          model: producto.modelo, // BD: modelo -> Frontend: model
          brand: producto.marca, // BD: marca -> Frontend: brand
          price: producto.precio, // BD: precio -> Frontend: price
          colors: [producto.color], // BD: color (string) -> Frontend: colors (array)
          sizes: tallesProducto.map(pt => ({
            size: pt.talle.numero.toString(),
            stock: pt.stock
          })),
          image: imagenPrincipal ? [imagenPrincipal.cloudinarySecureUrl] : ['/assets/imgNotFound.jpg'], // Imagen principal
          featured: producto.destacado, // BD: destacado -> Frontend: featured
          new: producto.nuevo, // BD: nuevo -> Frontend: new
          descripcion: producto.descripcion
        };
      });
      
      setProductRows(mappedProducts);
    }
  }, [productos, productoTalles, imagenesPrincipales]);

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!token || !productToDelete) return; // ✅ Verificar token

    try {
      await fetch(`http://localhost:8080/sapah/productos/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Usar token del contexto
          'Content-Type': 'application/json'
        }
      });

      eliminarProductoLocal(productToDelete);
      setProductRows(prev => prev.filter(p => p.id !== productToDelete));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    if (!token) return; // ✅ Verificar token

    try {
      const mappedFields = {};
      if (updatedFields.hasOwnProperty('featured')) {
        mappedFields.destacado = updatedFields.featured;
      }
      if (updatedFields.hasOwnProperty('new')) {
        mappedFields.nuevo = updatedFields.new;
      }

      await fetch(`http://localhost:8080/sapah/productos/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Usar token del contexto
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mappedFields)
      });

      actualizarProductoLocal(id, mappedFields);
      setProductRows(prev => 
        prev.map(row => 
          row.id === id ? { ...row, ...updatedFields } : row
        )
      );
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return {
    productRows,
    setProductRows,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleEdit,
    handleDelete,
    confirmDelete,
    updateProduct,
    loadingProductos,
    errorProductos,
  };
}
