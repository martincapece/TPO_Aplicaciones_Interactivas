import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AuthContext } from "../../auth/context/AuthContext";

export const PurchaseDetail = ({ productList, subtotal }) => {
    const { processCheckout, resetCart } = useCart();
    const navigate = useNavigate();

    const { authState } = useContext(AuthContext);
    const { idUsuario, token } = authState.user;
    
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
            if (!idUsuario) {
                throw new Error('No se encontró el id del cliente. Por favor, inicia sesión nuevamente.');
            }
            const medioPago = "Tarjeta de Crédito"; // TODO: obtener del formulario

            // Procesar la compra usando el backend real
            await processCheckout(idUsuario, token, medioPago);

            // Mostrar mensaje de éxito
            setShowSuccessModal(true);

        } catch (error) {
            setErrorMessage('Hubo un problema al procesar tu compra. Inténtalo nuevamente.');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuccessOk = () => {
        setShowSuccessModal(false);
        resetCart(); // Vacía el carrito después de cerrar el modal de éxito
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
            <Dialog
                open={showConfirmModal}
                onClose={handleCancel}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        backgroundColor: "white",
                        textAlign: "center",
                        p: 3,
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    },
                }}
            >
                <DialogTitle>¿Deseás confirmar tu compra?</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¡Todo listo para completar tu compra! Si confirmás, reservaremos tus productos.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={handleConfirmPurchase}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        Confirmar
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Éxito */}
            <Dialog
                open={showSuccessModal}
                onClose={handleSuccessOk}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        backgroundColor: "white",
                        textAlign: "center",
                        p: 3,
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'success.main' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 48, mb: 1 }} color="success" />
                    ¡Compra realizada!
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Tu compra fue procesada exitosamente
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={handleSuccessOk}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Error */}
            <Dialog
                open={showErrorModal}
                onClose={handleErrorOk}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        backgroundColor: "white",
                        textAlign: "center",
                        p: 3,
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    },
                }}
            >
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography color="error">
                        {errorMessage}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={handleErrorOk}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};