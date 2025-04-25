import './cart.css'
import CartItemList from './CartItemList';
import PurchaseDetail from './PurchaseDetail';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

function Cart() {
    const { productList, subtotal } = useCart()
    const navigate = useNavigate()

    const isEmpty = productList.length === 0;

    const handleBuyClick = () => {
        navigate('/') //redirige a la pagina principal
    }

    return (
        <div className="cart-container">
            {
                isEmpty
                    ? (
                        <div className="empty-cart">
                            <h1>Carrito vacío</h1>
                            <button className="buy-button" onClick={handleBuyClick}>Comprar</button>
                        </div>
                    )
                    : (
                        <>
                            <CartItemList productList={productList} />
                            <PurchaseDetail subtotal={subtotal} />
                        </>
                    )
            }
        </div>
    );
}


export default Cart;