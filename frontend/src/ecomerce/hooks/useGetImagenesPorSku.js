import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

export const useGetImagenesPorSku = ({ sku }) => {
    const [imagenes, setImagenes] = useState([]);
    const [loadingImagenes, setLoadingImagenes] = useState(false);
    const [errorImagenes, setErrorImagenes] = useState(null);
    const { authState } = useContext(AuthContext);
    const token = authState?.user?.token;
    const isAuthenticated = authState?.logged || false;

    useEffect(() => {
        if (!sku || !isAuthenticated || !token) {
            setLoadingImagenes(false);
            return;
        }

        const fetchImagenes = async () => {
            try {
                setLoadingImagenes(true);
                setErrorImagenes(null);
                
                const response = await fetch(`http://localhost:8080/api/imagenes/${sku}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                if (!response.ok) { 
                    throw new Error(`Error ${response.status}: ${response.statusText}`); 
                }

                const data = await response.json();
                setImagenes(data);
            } catch (err) {
                console.error(`Error obteniendo imágenes para SKU ${sku}:`, err);
                setErrorImagenes(err.message);
                setImagenes([]);
            } finally {
                setLoadingImagenes(false);
            }
        };

        fetchImagenes();
    }, [sku, isAuthenticated, token]);

    return { imagenes, loadingImagenes, errorImagenes };
};