import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../hooks/useCart';

function CartItem({ product }) {
  const { sku, modelo, marca, precio, color, numeroProducto, stock, image, quantity } = product;
  const {handleIncreaseQuantity, handleDecreaseQuantity} = useCart();
  
  return (
    <div className="cart-item">
      {/* Imagen + acciones */}
      <div className="image-section">
        <img src={image} alt={modelo} className="product-image" />
        <div className="actions">   
          {/* Control de cantidad */}
          <div className="quantity-control">
            <button onClick={() => handleDecreaseQuantity(sku, numeroProducto)}>
              <DeleteOutlineIcon fontSize="small" />
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => handleIncreaseQuantity(sku, numeroProducto)}
              disabled={quantity >= stock}
              title={quantity >= stock ? 'No se pueden agregar más productos. Límite de stock alcanzado.' : ''}
              style={{
                cursor: quantity >= stock ? 'not-allowed' : 'pointer',
                opacity: quantity >= stock ? 0.5 : 1
              }}
            >
              <AddIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>

      {/* Info del producto */}
      <div className="info-section">
        <h3>{modelo}</h3>
        <p>{marca}</p>
        <p className="size">
          Talle <span>{numeroProducto}</span>
        </p>
      </div>

      {/* Precio */}
      <div className="price-section" style={{ paddingRight: '20px' }}>
        ${(precio || 0).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;