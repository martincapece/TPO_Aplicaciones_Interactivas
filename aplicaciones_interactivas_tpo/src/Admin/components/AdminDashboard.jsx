import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import products from '../../mocks/products.json' // importo los products del mock
import { Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { Button, Box } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';



const columns = [
  { field: 'id', headerName: 'ID', width: 70 , sortable: false, filterable: false, headerAlign: 'center', align: 'center'},
  {
    field: 'img',
    headerName: 'Imagen',
    width: 130, renderCell: params => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%'
      }}>
        <img
          src={params.row.img}
          alt={params.row.name}
          style={{ width: 76, height: 76, objectFit: 'cover' }}
        />
      </div>
    ),
    sortable: false,
    filterable: false,
    headerAlign: 'center',
    align: 'center'
  },
  { field: 'name', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
  { field: 'brand', headerName: 'Marca', width: 130, headerAlign: 'center', align: 'center' },
  { field: 'price', headerName: 'Precio', width: 100, type: 'number', headerAlign: 'center', align: 'center' },
  {
    field: 'sizes',
    headerName: 'Tallas',
    width: 150,
    renderCell: (params) => {
      const sizes = Array.isArray(params.row.sizes) ? params.row.sizes : [];
    
      return (
        <Select
          value={sizes[0] || ''}
          size="small"
          fullWidth
          sx={{ backgroundColor: 'transparent' }}
        >
          {sizes.map((size, index) => (
            <MenuItem key={index} value={size}>
              {size}
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
  { field: 'stock', headerName: 'Stock', width: 100, type: 'number', headerAlign: 'center', align: 'center'},
  { field: 'category', headerName: 'Categoría', width: 130, headerAlign: 'center', align: 'center' },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
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
  },
];

const paginationModel = { page: 0, pageSize: 5 };

const handleEdit = (id) => {
  console.log(`Edit product with id: ${id}`);
  // Lógica para editar el producto
};

const handleDelete = (id) => {
  console.log(`Delete product with id: ${id}`);
  // Lógica para eliminar el producto
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mr={4} mt={2} ml={2}>
        <h1>DashBoard</h1>
        <Button variant="contained" color="primary" onClick={() => navigate('/inicio/admin/new-product')}>
          Agregar producto
        </Button>
    </Box>
    <Paper sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={row => row.id}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        rowHeight={80}
        sx={{ border: 0 }}
      />
    </Paper>
    </>
  );
}
