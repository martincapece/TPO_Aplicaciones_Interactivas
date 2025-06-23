import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

export const useGetTallesPorSkus = ({ skus }) => {
    const { authState } = useContext(AuthContext);
    const { token } = authState.user;

    const [ productoTalles, setProductoTalles ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchTalles = async () => {
            if (!skus || skus.length === 0) return;

            try {
                setLoading(true);
                const responses = await Promise.all(
                    skus.map(sku =>
                        fetch(`http://localhost:8080/sapah/productos-talles/${sku}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        }).then(res => res.json())
                    )
                );

                const allTalles = responses.flat();
                setProductoTalles(allTalles);
            } catch (err) {
                setError("Error al obtener talles");
            } finally {
                setLoading(false);
            }
        };

        fetchTalles();
    }, [skus]);

    return { productoTalles, loading, error };
};
