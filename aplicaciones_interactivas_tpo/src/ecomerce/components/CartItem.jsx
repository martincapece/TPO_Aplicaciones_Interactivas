import React from 'react';
import './cartItem.css';

const CartItemTry = ({ product }) => {
    const {
        name,
        type,
        color,
        size,
        price,
        originalPrice,
        img,
        quantity,
        promoEligible,
    } = product;

    return (
        <div className="cart-item">
            <img src={img} alt={name} className="cart-item__image" />

            <div className="cart-item__info">
                <h3 className="cart-item__name">{name}</h3>
                <p className="cart-item__type">{type}</p>
                <p className="cart-item__color">{color}</p>
                <p className="cart-item__size">Talla: <strong>{size}</strong></p>

                {!promoEligible && (
                    <p className="cart-item__promo-warning">
                        🔒 20% off El producto no participa en la promoción
                    </p>
                )}
            </div>

            <div className="cart-item__actions">
                <div className="cart-item__price">
                    <span className="original-price">${originalPrice.toFixed(2)}</span>
                    <span className="discounted-price">${price.toFixed(2)}</span>
                </div>

                <div className="cart-item__quantity">
                    <button className="qty-btn">−</button>
                    <span>{quantity}</span>
                    <button className="qty-btn">+</button>
                </div>

                <button className="remove-btn">Eliminar</button>
            </div>
        </div>
    );
};


const product = {
    img: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/60ca116d-704e-4710-a9d4-f2a7a5c1061d/M+J+FLT+ESS+85+SS+CREW.png',
    name: 'Nike T-shirt',
    type: 'T-shirt',
    color: 'Black',
    size: 'L',
    price: 29.99,       
    originalPrice: 39.99,
    quantity: 2,
    promoEligible: true,
   
}


const CartItem = () => {
    return (
        <CartItemTry product={product}/>
    )
}

export default CartItem;