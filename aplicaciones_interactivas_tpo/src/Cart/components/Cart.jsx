import './cart.css'
import CartItemList from './CartItemList';
import PurchaseDetail from './PurchaseDetail';
import { useCart } from '../hooks/useCart';

function Cart() {
    const {productList, subtotal} = useCart()
    
    return (
        <div className="cart-container">
            <CartItemList productList={productList} />
            <PurchaseDetail subtotal={subtotal} />
        </div>
    )
}


export default Cart;