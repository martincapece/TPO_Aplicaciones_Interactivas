import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { IconButton, Select, MenuItem, Checkbox, Button, Box } from '@mui/material'; // Asegúrate de importar Select y MenuItem
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { dataDestacados } from '../../ecomerce/data/dataDestacados'; // Asegúrate de que este path sea correcto

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [productRows, setProductRows] = React.useState(
    dataDestacados.map(producto => ({ ...producto, featured: false })) // Añadir la propiedad 'featured'
  );

  const handleEdit = (id) => {
    console.log(`Edit product with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete product with id: ${id}`);
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
    {
      field: 'featured',
      headerName: 'Destacado',
      flex: 0.1,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.featured}
          onChange={() => {
            const updatedRows = productRows.map((row) =>
              row.id === params.row.id ? { ...row, featured: !row.featured } : row
            );
            setProductRows(updatedRows);
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
          pageSize={5} // Tamaño de página inicial
          pageSizeOptions={[5, 10, productRows.length]} // Opciones de tamaño de página disponibles
          checkboxSelection
          rowHeight={80}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
          pagination
        />
      </Paper>
    </>
  );
}
