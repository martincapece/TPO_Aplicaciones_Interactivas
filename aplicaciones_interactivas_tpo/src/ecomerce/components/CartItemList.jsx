import CartItem from './CartItem';
import './cartItem.css'
import './cart.css'
import { useEffect, useState, useCallback } from 'react';





function CartItemList() {
    const [subtotal, setSubtotal] = useState(0);
    const [productList, setProductList] = useState([
        {
            id: 1,
            name: "Product 1",
            type: "Type A",
            color: "Red",
            size: "M",
            price: 29.99,
            quantity: 1,
            img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5ccc7a60-e8c5-48aa-9d72-3fa75445fc4a/NIKE+C1TY.png",
        },
        {
            id: 2,
            name: "Product 2",
            type: "Type A",
            color: "Red",
            size: "M",
            price: 29.99,
            quantity: 1,
            img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5ccc7a60-e8c5-48aa-9d72-3fa75445fc4a/NIKE+C1TY.png",
        },
        {
            id: 3,
            name: "Product 3",
            type: "Type A",
            color: "Red",
            size: "M",
            price: 29.99,
            quantity: 1,
            img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5ccc7a60-e8c5-48aa-9d72-3fa75445fc4a/NIKE+C1TY.png",
        },
    ]);

    //  funcion que maneja aumentar la cantidad de un mismo producto
    const handleQuantityIncrease = (id) => {
        setProductList(prev =>
            prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
        );
    };

    const handleQuantityDecrease = (id) => {
        setProductList(prev =>
            prev
                .map(p => p.id === id ? { ...p, quantity: p.quantity - 1 } : p)
                .filter(p => p.quantity > 0) // si llega a 0, lo eliminamos
        );
    };

    
    //calcula el subtotal SOLO si hay un cambio en la lista
    const handleSubtotal = useCallback(() => {
        let amount = 0;
        for (let product of productList) {
            amount += product.price * parseFloat(product.quantity);
        }
        setSubtotal(amount);
    }, [productList]);


    useEffect(() => {
        handleSubtotal();
    }, [handleSubtotal]);


    return (
        <div className="cart-container">
            <div className="cart-left">
                <h1>Bolsa de compra</h1>
                {productList.map((product) => (
                    <CartItem 
                        key={product.id} 
                        product={product}
                        onIncrease={handleQuantityIncrease}
                        onDecrease={handleQuantityDecrease}
                    />
                ))}
            </div>
            <div className="cart-right">
                <h2>Resumen</h2>
                <p>Subtotal: ${subtotal}</p>
                <p>Envío: Gratis</p>
                <p>Descuento: -$20.00</p>
                <h3>Total: ${subtotal}</h3> {/*TODO: calcular el total, segun corresponda*/}
                <button className="checkout-button">Pagar</button>
            </div>
        </div>
    );
}

export default CartItemList;