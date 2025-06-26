import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

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
  const { authState } = useContext(AuthContext);
  const token = authState?.user?.token;
  const isAuthenticated = authState?.logged || false;
  useEffect(() => {
    // Solo hacer fetch si el usuario está autenticado y tiene token
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

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

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();
        setProductos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductosFiltrados();
  }, [isAuthenticated, token, marca, modelo, color, minPrecio, maxPrecio, destacados, nuevos]);

  return { productos, loading, error };
};
