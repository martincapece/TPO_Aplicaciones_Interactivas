import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext'; // ✅ AGREGAR

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
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [errorCompras, setErrorCompras] = useState(null);

  // ✅ AGREGAR: Obtener token del contexto
  const { authState } = useContext(AuthContext);
  const token = authState?.user?.token;

  useEffect(() => {
    const fetchCompras = async () => {
      if (!token) return; // ✅ No hacer fetch sin token

      setLoadingCompras(true);
      setErrorCompras(null);

      try {
        const response = await fetch('http://localhost:8080/sapah/compras', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // ✅ Usar token del contexto
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Mapear los datos al formato esperado por el DataGrid
        const mappedData = data.map(compra => ({
          nroCompra: compra.nroCompra,
          nombreComprador: compra.nombreComprador || 'N/A',
          emailComprador: compra.emailComprador || 'N/A',
          fechaTimestamp: compra.fechaTimestamp || 0,
          montoTotal: compra.montoTotal || 0,
          medioPago: compra.medioPago || 'N/A',
          cantidadItems: compra.cantidadItems || 0
        }));

        setCompraRows(mappedData);
      } catch (error) {
        setErrorCompras(error.message);
      } finally {
        setLoadingCompras(false);
      }
    };

    fetchCompras();
  }, [token]); // ✅ Dependencia del token

  return {
    compraRows,
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
