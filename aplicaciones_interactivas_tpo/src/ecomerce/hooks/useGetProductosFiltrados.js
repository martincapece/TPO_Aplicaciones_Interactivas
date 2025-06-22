import { useState, useEffect, useCallback } from "react";

export const useGetProductosFiltrados = ({ destacados = null, nuevos = null }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (destacados !== null) params.append("destacados", destacados);
      if (nuevos !== null) params.append("nuevos", nuevos);

      const response = await fetch(`http://localhost:8080/sapah/productos/filter?${params.toString()}`);
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [destacados, nuevos]);

  // Llamada inicial
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return { productos, loading, error, refetch: fetchProductos };
};
