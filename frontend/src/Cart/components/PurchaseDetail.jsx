import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Swal from 'sweetalert2'

export const PurchaseDetail = ({ productList, subtotal }) => {
    const { processCheckout, resetCart } = useCart();
    const navigate = useNavigate();

    const discount = 5;
    const shipping = 0; //costo de envio
    const total = subtotal - discount + shipping;

    const onSubmit = async() => {
        const result = await Swal.fire({
            title: '¿Deseás confirmar tu compra?',
            text: '¡Todo listo para completar tu compra! Si confirmás, reservaremos tus productos.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                // Datos temporales - deberías obtenerlos del usuario logueado
                const idCliente = 1; // TODO: obtener del contexto de autenticación
                const medioPago = "Tarjeta de Crédito"; // TODO: obtener del formulario

                // Procesar la compra usando el backend real
                await processCheckout(idCliente, medioPago);

                // Mostrar mensaje de éxito
                await Swal.fire({
                    title: '¡Compra realizada!',
                    text: 'Tu compra fue procesada exitosamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // Navegar al inicio (el resetCart ya se ejecuta dentro de processCheckout)
                navigate('/inicio');

            } catch (error) {
                console.error('Error al procesar la compra:', error);
                
                // Mostrar mensaje de error
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al procesar tu compra. Inténtalo nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            Swal.fire('Cancelado', 'Tu compra no fue procesada.', 'info');
        }
    }
    
    return (
        <div className="cart-right">
            <h2>Resumen</h2>
            <p>Subtotal: ${subtotal}</p>
            <p>Envío: {shipping === 0 ? 'Gratis' : shipping}</p>
            <p>Descuento: -${subtotal === 0 ? 0 : discount}</p>
            <h3>Total: ${total < 0 ? 0 : total}</h3>
            <button type="submit" onClick={ onSubmit } className="checkout-button">Pagar</button>
            <button type="submit" onClick={ resetCart } className="reset-button">Vaciar Carrito</button>
        </div>
    )
}