import CartItem from './CartItem';
import './cartItem.css'

function CartItemList({ productList}) {
    return (
        <div className="cart-left">
            <h1>Bolsa de compra</h1>
            {productList.map((product) => (
                <CartItem
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}

export default CartItemList;