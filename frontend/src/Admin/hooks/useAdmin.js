import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ProductosContext } from '../../ecomerce/context/ProductosContext';
import { AuthContext } from '../../auth/context/AuthContext'; // ✅ AGREGAR
import Swal from 'sweetalert2'; // ✅ AGREGAR SweetAlert para notificaciones

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
      
      // ✅ PASO 1: Eliminar todas las imágenes del producto primero
      try {
        const deleteImagesResponse = await fetch(`http://localhost:8080/api/imagenes/producto/${productToDelete}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (deleteImagesResponse.ok) {
          const imageResult = await deleteImagesResponse.json();
        } else {
          console.error('⚠️ No se pudieron eliminar las imágenes o el producto no tenía imágenes');
        }
      } catch (imageError) {
        console.error('⚠️ Error al eliminar imágenes (continuando con eliminación del producto):', imageError);
      }

      // ✅ PASO 2: Eliminar el producto
      const deleteProductResponse = await fetch(`http://localhost:8080/sapah/productos/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!deleteProductResponse.ok) {
        throw new Error('Error al eliminar el producto');
      }

      // ✅ PASO 3: Actualizar contexto y UI
      eliminarProductoLocal(productToDelete);
      setProductRows(prev => prev.filter(p => p.id !== productToDelete));
      setDeleteDialogOpen(false);
      setProductToDelete(null);

      // ✅ Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Producto eliminado!',
        text: 'El producto y sus imágenes han sido eliminados correctamente',
        confirmButtonText: 'Perfecto',
        timer: 2000
      });
      
    } catch (error) {
      console.error("❌ Error al eliminar el producto:", error);
      
      // ✅ Mostrar error con SweetAlert
      await Swal.fire({
        icon: 'error',
        title: 'Error al eliminar producto',
        text: 'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Entendido'
      });
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
