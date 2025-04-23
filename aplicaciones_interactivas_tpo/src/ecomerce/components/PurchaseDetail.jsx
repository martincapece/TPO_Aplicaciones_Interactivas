
function PurchaseDetail({ subtotal }) {
    const discount = 5;
    const shipping = 0; //costo de envio
    const total = subtotal - discount + shipping;

    return (
        <div className="cart-right">
            <h2>Resumen</h2>
            <p>Subtotal: ${subtotal}</p>
            <p>Envío: {shipping === 0 ? 'Gratis' : shipping}</p>
            <p>Descuento: -${subtotal === 0 ? 0 : discount}</p>
            <h3>Total: ${total < 0 ? 0 : total}</h3> {/*TODO: calcular el total, segun corresponda*/}
            <button className="checkout-button">Pagar</button>
        </div>
    )
}

export default PurchaseDetail;





/*
function PurchaseDetail({ subtotal }) {
    const discount = 5;
    const shipping = 0;
    const total = subtotal - discount + shipping;

    return (
        <div className="cart-right">
            <h2>Resumen</h2>

            <div className="cart-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-line">
                <span>Envío:</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="cart-line">
                <span>Descuento:</span>
                <span>-${subtotal === 0 ? '0.00' : discount.toFixed(2)}</span>
            </div>

            <div className="cart-line total">
                <strong>Total:</strong>
                <strong>${(total < 0 ? 0 : total).toFixed(2)}</strong>
            </div>

            <button className="checkout-button">Pagar</button>
        </div>
    );
}
*/