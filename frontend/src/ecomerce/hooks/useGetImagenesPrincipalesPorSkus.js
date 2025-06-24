import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

export const useGetImagenesPrincipalesPorSkus = (skus = []) => {
  const [imagenesPorSku, setImagenesPorSku] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { token } = authState.user;

  useEffect(() => {
    if (!Array.isArray(skus) || skus.length === 0) return;

    const fetchImagenes = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultados = await Promise.all(
          skus.map(async (sku) => {
            const response = await fetch(`http://localhost:8080/api/imagenes/${sku}/principal`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) throw new Error(`Error al traer imagen para SKU: ${sku}`);

            const data = await response.json();
            return { sku, imagen: data.cloudinarySecureUrl }; // o `data` si querés todo
          })
        );

        const imagenesMap = {};
        resultados.forEach(({ sku, imagen }) => {
          imagenesMap[sku] = imagen;
        });

        setImagenesPorSku(imagenesMap);
      } catch (err) {
        console.error("Error al cargar imágenes principales:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchImagenes();
  }, [skus]);

  return { imagenesPorSku, loading, error };
};