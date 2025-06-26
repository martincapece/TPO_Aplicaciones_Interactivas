import * as React from 'react';
import { useContext } from 'react'; // ✅ AGREGAR
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import { useCompras } from '../hooks/useCompras';
import AdminNavigation from '../components/AdminNavigation';
import { AuthContext } from '../../auth/context/AuthContext'; // ✅ AGREGAR

export default function ComprasPage() {
  // ✅ AGREGAR: Verificación de autenticación
  const { authState } = useContext(AuthContext);
  const token = authState?.user?.token;

  const {
    compraRows,
    loadingCompras,
    errorCompras,
  } = useCompras();

  // ✅ AGREGAR: Verificar que el usuario esté logueado
  if (!authState?.logged || !token) {
    return (
      <Grid sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Por favor, inicia sesión para acceder al panel de administración.</Typography>
      </Grid>
    );
  }

  // Validadores robustos
  const formatFecha = (value) => {
    const timestamp = Number(value);
    if (!isNaN(timestamp) && timestamp > 0) {
      const fecha = new Date(timestamp);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'N/A';
  };

  const formatMonto = (value) => {
    const monto = Number(value);
    if (!isNaN(monto)) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(monto);
    }
    return '-';
  };

  const columns = [
    { 
      field: 'nroCompra', 
      headerName: 'N° Compra', 
      flex: 0.1, 
      headerAlign: 'center', 
      align: 'center',
      type: 'number'
    },
    { 
      field: 'nombreComprador', 
      headerName: 'Comprador', 
      flex: 0.2, 
      headerAlign: 'center', 
      align: 'center'
    },
    { 
      field: 'emailComprador', 
      headerName: 'Email', 
      flex: 0.2, 
      headerAlign: 'center', 
      align: 'center'
    },
    { 
      field: 'fechaTimestamp',
      headerName: 'Fecha',
      flex: 0.15,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      type: 'number',
      renderCell: (params) => {
        return formatFecha(params.row.fechaTimestamp);
      },
    },
    { 
      field: 'montoTotal',
      headerName: 'Monto Total',
      flex: 0.15,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => formatMonto(params.row.montoTotal)
    },
    {
      field: 'medioPago',
      headerName: 'Medio de Pago',
      flex: 0.15,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
          size="small"
        />
      )
    },
    { 
      field: 'cantidadItems', 
      headerName: 'Items', 
      flex: 0.1, 
      type: 'number',
      headerAlign: 'center', 
      align: 'center'
    }
  ];

  // Mostrar loading mientras cargan las compras
  if (loadingCompras) {
    return (
      <Grid sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando historial de compras...</Typography>
      </Grid>
    );
  }

  // Mostrar error si hay problemas
  if (errorCompras) {
    return (
      <Grid sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6">Error al cargar compras</Typography>
          <Typography>{errorCompras}</Typography>
        </Alert>
      </Grid>
    );
  }

  // Mensajes de advertencia si hay datos inválidos
  const comprasSinFecha = compraRows.filter(row => !row.fechaTimestamp || isNaN(Number(row.fechaTimestamp)));
  const comprasMontoInvalido = compraRows.filter(row => isNaN(Number(row.montoTotal)));

  return (
    <Grid sx={{ height: '100vh' }}>
      <Box sx={{ p: 2 }}>
        <AdminNavigation />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h1>Historial de Compras</h1>
          <Typography variant="body2" color="text.secondary">
            Total de compras: {compraRows.length}
          </Typography>
        </Box>
        
        {compraRows.length === 0 && !loadingCompras && !errorCompras && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay compras registradas en el sistema.
          </Alert>
        )}

        {comprasSinFecha.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Algunas compras no tienen fecha válida. Se mostrarán como "N/A".
          </Alert>
        )}

        {comprasMontoInvalido.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Algunas compras tienen monto inválido. Se mostrarán como "-".
          </Alert>
        )}
        
        <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
          <DataGrid
            key={`compras-grid-${compraRows.length}`}
            rows={compraRows}
            columns={columns}
            getRowId={(row) => row.nroCompra} // <--- usa nroCompra como id
            pageSize={10}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{ border: 0 }}
            pagination
            initialState={{
              sorting: {
                sortModel: [{ field: 'fechaTimestamp', sort: 'desc' }],
              },
            }}
            error={errorCompras}
            loading={loadingCompras}
          />
        </Paper>
      </Box>
    </Grid>
  );
}