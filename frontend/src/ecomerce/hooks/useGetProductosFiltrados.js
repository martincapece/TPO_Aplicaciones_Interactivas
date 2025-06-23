import { useEffect, useState } from "react";

export const useGetProductosFiltrados = ({
  marca = null,
  modelo = null,
  color = null,
  minPrecio = null,
  maxPrecio = null,
  destacados = null,
  nuevos = null,
} = {}) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductosFiltrados = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (marca) params.append("marca", marca);
        if (modelo) params.append("modelo", modelo);
        if (color) params.append("color", color);
        if (minPrecio !== null) params.append("minPrecio", minPrecio);
        if (maxPrecio !== null) params.append("maxPrecio", maxPrecio);
        if (destacados !== null) params.append("destacados", destacados);
        if (nuevos !== null) params.append("nuevos", nuevos);

        const endpoint =
          params.toString().length > 0
            ? `http://localhost:8080/sapah/productos/filter?${params.toString()}`
            : `http://localhost:8080/sapah/productos`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductosFiltrados();
  }, []);

  return { productos, loading, error };
};
