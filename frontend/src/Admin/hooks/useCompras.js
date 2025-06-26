import { useState, useEffect } from 'react';

export function useCompras() {
  const [compraRows, setCompraRows] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(true);
  const [errorCompras, setErrorCompras] = useState(null);

  // Cargar compras desde la API
  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoadingCompras(true);
        
        const token = localStorage.getItem('token');
        console.log('Token disponible:', !!token);
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost:8080/sapah/compras', {
          headers
        });

        console.log('Response status:', response.status);

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
        console.log('Compras recibidas del backend:', compras);
        
        // Mapear compras al formato que espera el DataGrid
        const mappedCompras = compras.map(compra => {
          console.log('Procesando compra:', compra);
          
          // Crear fecha original para ordenamiento
          const fechaOriginal = compra.fecha ? new Date(compra.fecha) : new Date();
          const fechaTimestamp = fechaOriginal.getTime();
          
          console.log('Fecha original:', fechaOriginal);
          console.log('Fecha timestamp:', fechaTimestamp);
          
          const mappedCompra = {
            id: compra.nroCompra,
            nroCompra: compra.nroCompra,
            nombreComprador: compra.cliente?.nombreCompleto || 'N/A',
            emailComprador: compra.cliente?.mail || 'N/A',
            fechaOriginal: fechaOriginal, // Para visualización
            fechaTimestamp: fechaTimestamp, // Para ordenamiento
            montoTotal: compra.precioFinal || 0,
            medioPago: compra.medioPago || 'N/A',
            cantidadItems: compra.items?.length || 0
          };
          
          console.log('Compra mapeada:', mappedCompra);
          return mappedCompra;
        });

        console.log('Compras mapeadas finales:', mappedCompras);
        
        // Verificar que cada compra tiene fechaOriginal
        mappedCompras.forEach((compra, index) => {
          if (!compra.fechaOriginal || !(compra.fechaOriginal instanceof Date)) {
            console.error(`Compra ${index} no tiene fechaOriginal válida:`, compra);
          }
          if (!compra.fechaTimestamp || typeof compra.fechaTimestamp !== 'number') {
            console.error(`Compra ${index} no tiene fechaTimestamp válida:`, compra);
          }
        });
        
        setCompraRows(mappedCompras);
        setErrorCompras(null);
      } catch (error) {
        console.error('Error al cargar compras:', error);
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
    errorCompras
  };
} 