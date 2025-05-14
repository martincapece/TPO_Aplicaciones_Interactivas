import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {
  IconButton, Select, MenuItem, Checkbox, Button,
  Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [productRows, setProductRows] = React.useState([]);
  const [productos, setProductos] = React.useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:3000/data")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos", err));
  }, []);

  React.useEffect(() => {
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

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.1, headerAlign: 'center', align: 'center' },
    {
      field: 'image',
      headerName: 'Imagen',
      flex: 0.2,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img
            src={params.row.image[0]}
            alt={params.row.model}
            style={{ width: 76, height: 76, objectFit: 'cover' }}
          />
        </div>
      ),
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'model', headerName: 'Modelo', flex: 0.2, headerAlign: 'center', align: 'center' },
    { field: 'brand', headerName: 'Marca', flex: 0.15, headerAlign: 'center', align: 'center' },
    { field: 'price', headerName: 'Precio', flex: 0.1, type: 'number', headerAlign: 'center', align: 'center' },
    {
      field: 'sizes',
      headerName: 'Tallas',
      flex: 0.2,
      renderCell: (params) => {
        const sizes = Array.isArray(params.row.sizes) ? params.row.sizes : [];
        return (
          <Select
            value={sizes[0]?.size || ''}
            size="small"
            fullWidth
            sx={{ backgroundColor: 'transparent' }}
          >
            {sizes.map((item, index) => (
              <MenuItem key={index} value={item.size}>
                {item.size} (stock: {item.stock})
              </MenuItem>
            ))}
          </Select>
        );
      },
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'featured',
      headerName: 'Destacado',
      flex: 0.1,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.featured}
          onChange={async () => {
            const updatedValue = !params.row.featured;
            const updatedRows = productRows.map((row) =>
              row.id === params.row.id ? { ...row, featured: updatedValue } : row
            );
            setProductRows(updatedRows);
            await updateProduct(params.row.id, { featured: updatedValue });
          }}
          color="primary"
        />
      ),
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'new',
      headerName: 'Nuevo',
      flex: 0.1,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.new}
          onChange={async () => {
            const updatedValue = !params.row.new;
            const updatedRows = productRows.map((row) =>
              row.id === params.row.id ? { ...row, new: updatedValue } : row
            );
            setProductRows(updatedRows);
            await updateProduct(params.row.id, { new: updatedValue });
          }}
          color="primary"
        />
      ),
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.2,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center'
    }
  ];

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mr={4} mt={2} ml={2}>
        <h1>Dashboard</h1>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/new-product')}>
          Agregar producto
        </Button>
      </Box>
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={productRows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={5}
          pageSizeOptions={[5, 10, productRows?.length || 5]}
          checkboxSelection
          rowHeight={80}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
          pagination
        />
      </Paper>

      {/* Dialogo de confirmación para eliminar producto */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
