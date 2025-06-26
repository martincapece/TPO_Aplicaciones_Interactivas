import { useState, useEffect } from 'react';

// FUNCIONES DIRECTAS EN EL COMPONENTE
const formatFecha = (value) => {
  if (!value) return 'N/A';
  const fecha = new Date(value);
  return isNaN(fecha.getTime())
    ? 'N/A'
    : fecha.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const formatMonto = (value) => {
  if (value === null || value === undefined) return '-';
  const monto = Number(value);
  return isNaN(monto)
    ? '-'
    : new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
      }).format(monto);
};

export function useCompras() {
  const [compraRows, setCompraRows] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(true);
  const [errorCompras, setErrorCompras] = useState(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoadingCompras(true);
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch('http://localhost:8080/sapah/compras', {
          headers,
        });

        if (response.status === 401) {
          throw new Error('No autorizado. Verifique su token de autenticación.');
        }
        if (response.status === 403) {
          throw new Error('Acceso denegado. No tiene permisos para ver las compras.');
        }
        if (!response.ok) {
          throw new Error(`Error al cargar las compras: ${response.status} ${response.statusText}`);
        }

        const compras = await response.json();

        const mappedCompras = compras.map((compra) => {
          const fecha = compra.fechaTimestamp || compra.fecha || compra.fechaCompra;
          return {
            nroCompra: compra.nroCompra,
            nombreComprador: compra.nombreComprador,
            emailComprador: compra.emailComprador,
            fechaTimestamp: fecha,
            montoTotal: compra.montoTotal,
            medioPago: compra.medioPago,
            cantidadItems: compra.cantidadItems,
          };
        });

        setCompraRows(mappedCompras);
        setErrorCompras(null);
      } catch (error) {
        setErrorCompras(error.message);
      } finally {
        setLoadingCompras(false);
      }
    };
    fetchCompras();
  }, []);

  return {
    compraRows,
    setCompraRows,
    loadingCompras,
    errorCompras,
  };
}

// Exporta las columnas para el DataGrid
export const columns = [
  { field: 'nroCompra', headerName: 'N° Compra', flex: 0.1, headerAlign: 'center', align: 'center' },
  { field: 'nombreComprador', headerName: 'Nombre Comprador', flex: 0.15, headerAlign: 'center', align: 'center' },
  { field: 'emailComprador', headerName: 'Email Comprador', flex: 0.2, headerAlign: 'center', align: 'center' },
  {
    field: 'fechaTimestamp',
    headerName: 'Fecha',
    flex: 0.15,
    headerAlign: 'center',
    align: 'center',
    sortable: true,
    valueFormatter: (params) => formatFecha(params.value),
  },
  {
    field: 'montoTotal',
    headerName: 'Monto Total',
    flex: 0.15,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: (params) => formatMonto(params.value),
  },
  {
    field: 'medioPago',
    headerName: 'Medio de Pago',
    flex: 0.1,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'cantidadItems',
    headerName: 'Cantidad de Items',
    flex: 0.1,
    headerAlign: 'center',
    align: 'center',
  },
];
