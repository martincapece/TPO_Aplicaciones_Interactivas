import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

export const useGetImagenesPorSku = ({ sku }) => {
    const [ imagenes, setImagenes ] = useState([]);
    const [ loadingImagenes, setLoadingImagenes ] = useState(true);
    const [ errorImagenes, setErrorImagenes ] = useState(null);
    const { authState } = useContext(AuthContext);
    const { token } = authState.user;

    useEffect(() => {
        if (!sku) return;

        const fetchImagenes = async () => {
            try {
                setLoadingImagenes(true);
                const response = await fetch(`http://localhost:8080/api/imagenes/${sku}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) { throw new Error("La solicitud no fue exitosa"); };

            const data = await response.json();
            setImagenes(data);
        } catch (err) {
            setErrorImagenes(true);
        } finally {
            setLoadingImagenes(false);
        }
    };

    fetchImagenes();
}, [sku]);

return { imagenes, loadingImagenes, errorImagenes };
};