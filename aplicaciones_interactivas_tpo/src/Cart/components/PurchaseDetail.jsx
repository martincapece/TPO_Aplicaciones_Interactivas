import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Swal from 'sweetalert2'

export const PurchaseDetail = ({ productList, subtotal }) => {
    const { discountStock, resetCart, } = useCart();
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
                // Agrupar productos por id + talle
                const grouped = {};

                productList.forEach((item) => {
                const key = `${item.id}-${item.size}`;
                if (!grouped[key]) {
                    grouped[key] = {
                        id: item.id,
                        size: item.size,
                        quantity: item.quantity
                    };
                } else {
                    grouped[key].quantity += item.quantity;
                }
                });

                // Agrupar por productoId para enviar una sola petición por producto
                const groupedByProduct = {};

                Object.values(grouped).forEach(({ id, size, quantity }) => {
                if (!groupedByProduct[id]) {
                    groupedByProduct[id] = [];
                }
                groupedByProduct[id].push({ size, quantity });
                });

                // Ahora hacemos una sola petición por producto
                for (const productId in groupedByProduct) {
                await discountStock(productId, groupedByProduct[productId]);
                }

                // alert("Compra realizada con éxito ✅");
                resetCart();
                navigate('/inicio');

                // (Opcional) limpiar carrito acá
                // clearCart();

            } catch (error) {
                console.error(error);
                // alert("Hubo un error al procesar la compra");
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
            <h3>Total: ${total < 0 ? 0 : total}</h3> {/*TODO: calcular el total, segun corresponda*/}
            <button type="submit" onClick={ onSubmit } className="checkout-button">Pagar</button>
            <button type="submit" onClick={ resetCart } className="reset-button">Vaciar Carrito</button>
        </div>
    )
}