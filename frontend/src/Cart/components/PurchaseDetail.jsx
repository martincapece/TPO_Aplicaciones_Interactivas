import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export const PurchaseDetail = ({ productList, subtotal }) => {
    const { processCheckout, resetCart } = useCart();
    const navigate = useNavigate();
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const discount = 5;
    const shipping = 0; //costo de envio
    const total = subtotal - discount + shipping;

    const onSubmit = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmPurchase = async () => {
        setShowConfirmModal(false);
        setIsProcessing(true);

        try {
            // Obtener idCliente real del localStorage
            const idCliente = localStorage.getItem('idCliente');
            if (!idCliente) {
                throw new Error('No se encontró el id del cliente. Por favor, inicia sesión nuevamente.');
            }
            const medioPago = "Tarjeta de Crédito"; // TODO: obtener del formulario

            // Procesar la compra usando el backend real
            await processCheckout(idCliente, medioPago);

            // Mostrar mensaje de éxito
            setShowSuccessModal(true);

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            setErrorMessage('Hubo un problema al procesar tu compra. Inténtalo nuevamente.');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuccessOk = () => {
        setShowSuccessModal(false);
        navigate('/inicio');
    };

    const handleErrorOk = () => {
        setShowErrorModal(false);
        setErrorMessage("");
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
    };
    
    return (
        <>
            <div className="cart-right">
                <h2>Resumen</h2>
                <p>Subtotal: ${subtotal}</p>
                <p>Envío: {shipping === 0 ? 'Gratis' : shipping}</p>
                <p>Descuento: -${subtotal === 0 ? 0 : discount}</p>
                <h3>Total: ${total < 0 ? 0 : total}</h3>
                <button 
                    type="submit" 
                    onClick={onSubmit} 
                    className="checkout-button"
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Procesando...' : 'Pagar'}
                </button>
                <button type="submit" onClick={resetCart} className="reset-button">Vaciar Carrito</button>
            </div>

            {/* Modal de Confirmación */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>¿Deseás confirmar tu compra?</h3>
                        <p>¡Todo listo para completar tu compra! Si confirmás, reservaremos tus productos.</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirmPurchase} className="confirm-button">
                                Sí, confirmar
                            </button>
                            <button onClick={handleCancel} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>¡Compra realizada!</h3>
                        <p>Tu compra fue procesada exitosamente</p>
                        <div className="modal-buttons">
                            <button onClick={handleSuccessOk} className="success-button">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Error */}
            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Error</h3>
                        <p>{errorMessage}</p>
                        <div className="modal-buttons">
                            <button onClick={handleErrorOk} className="error-button">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};