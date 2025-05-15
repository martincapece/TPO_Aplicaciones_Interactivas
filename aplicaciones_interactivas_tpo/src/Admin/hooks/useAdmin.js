import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function useAdmin() {
  const navigate = useNavigate();
  const [productRows, setProductRows] = useState([]);
  const [productos, setProductos] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos", err));
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      setProductRows(productos);
    }
  }, [productos]);

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/data/${productToDelete}`, {
        method: 'DELETE',
      });

      setProductos(prev => prev.filter(p => p.id !== productToDelete));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await fetch(`http://localhost:3000/data/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return {
    productRows,
    setProductRows,
    deleteDialogOpen,
    setDeleteDialogOpen,
    productToDelete,
    setProductToDelete,
    handleEdit,
    handleDelete,
    confirmDelete,
    updateProduct,
  };
}
