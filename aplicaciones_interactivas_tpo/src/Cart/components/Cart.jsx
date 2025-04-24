import { useEffect, useState, useCallback } from 'react';
import './cart.css'
import CartItemList from './CartItemList';
import PurchaseDetail from './PurchaseDetail';

function Cart() {
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

    const handleQuantityIncrease = (id) => {
        setProductList(prev =>
            prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
        );
    };

    const handleQuantityDecrease = (id) => {
        setProductList(prev =>
            prev
                .map(p => p.id === id ? { ...p, quantity: p.quantity - 1 } : p)
                .filter(p => p.quantity > 0)
        );
    };

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
            <CartItemList
                productList={productList}
                onIncrease={handleQuantityIncrease}
                onDecrease={handleQuantityDecrease}
            />
            
            <PurchaseDetail subtotal={subtotal} />
        </div>
    )
}


export default Cart;