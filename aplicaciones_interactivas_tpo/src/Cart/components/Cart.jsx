import './cart.css'
import CartItemList from './CartItemList';
import PurchaseDetail from './PurchaseDetail';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { Grid } from '@mui/material';

function Cart() {
    const { productList, subtotal } = useCart()
    const navigate = useNavigate()

    const isEmpty = productList.length === 0;

    const handleBuyClick = () => {
        navigate('/') //redirige a la pagina principal
    }

    return (
        <Grid
        container
        sx={{
            margin: '0 auto',
            maxWidth: '50%',
        }}
        >
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
        </Grid>
    );
}


export default Cart;