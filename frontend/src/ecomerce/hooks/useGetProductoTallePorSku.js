import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

export const useGetProductoTallePorSku = ({ sku }) => {
    const { authState } = useContext(AuthContext);
    const { token } = authState.user;

    const [ productoTalles, setProductoTalles ] = useState([]);
    const [ loadingTalle, setLoadingTalle ] = useState(true);
    const [ errorTalle, setErrorTalle ] = useState(null);

    useEffect(() => {
        const fetchProductoTalles = async () => {
            if (!sku) return;

            try {
                setLoadingTalle(true);
                const response = await fetch(`http://localhost:8080/sapah/productos-talles/${sku}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("Error al obtener los talles");

                const data = await response.json();
                setProductoTalles(data);
            } catch (err) {
                setErrorTalle(err.message);
            } finally {
                setLoadingTalle(false);
            }
        };

        fetchProductoTalles();
    }, [sku]);

    return { productoTalles, loadingTalle, errorTalle };
};
