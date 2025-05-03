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
        justifyContent='space-between'
        sx={{
            margin: '0 auto',
            maxWidth: '65%',
            marginTop: 5,
            mb: 15,
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
                        <Grid container spacing={ 2 } width='100%' >
                            <Grid size={{ xs: 12, md: 9 }} mb={ 8 } >
                                <CartItemList productList={productList} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }} > 
                                <PurchaseDetail subtotal={subtotal} />
                            </Grid>
                        </Grid>
                    )
            }
        </Grid>
    );
}


export default Cart;