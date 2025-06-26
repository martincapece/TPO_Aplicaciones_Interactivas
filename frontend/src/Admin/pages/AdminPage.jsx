import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {
  IconButton, Select, MenuItem, Checkbox, Button,
  Box,
  Grid,
  CircularProgress,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmationDialog from '../components/ConfirmationDialog';
import AdminNavigation from '../components/AdminNavigation';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin'; 

export default function AdminPage() {
  const navigate = useNavigate();
  const {
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
  } = useAdmin();

  const columns = [
    { field: 'id', headerName: 'SKU', flex: 0.1, headerAlign: 'center', align: 'center' },
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
            onError={(e) => {
              e.target.src = '/assets/imgNotFound.jpg'; // Imagen por defecto si falla
            }}
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

  // Mostrar loading mientras cargan los productos
  if (loadingProductos) {
    return (
      <Grid sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando productos...</Typography>
      </Grid>
    );
  }

  // Mostrar error si hay problemas
  if (errorProductos) {
    return (
      <Grid sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">Error al cargar productos: {errorProductos}</Typography>
      </Grid>
    );
  }

  return (
    <Grid sx={{ height: '100vh' }}>
      <Box sx={{ p: 2 }}>
        <AdminNavigation />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h1>Productos</h1>
          <Button variant="contained" color="primary" onClick={() => navigate('/admin/new-product')}>
            Agregar producto
          </Button>
        </Box>
        <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
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
      </Box>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          setDeleteDialogOpen(false);
          setTimeout(() => {
            confirmDelete();
          }, 0);
        }}
        title="¿Eliminar producto?"
        message="¿Estás seguro? Esta acción no se puede deshacer."
      />
    </Grid>
  );
}
