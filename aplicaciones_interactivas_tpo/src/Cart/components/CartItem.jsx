import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../hooks/useCart';

function CartItem({ product }) {
  const { id, model, brand, colors, size, stock, price, image, quantity } = product;
  const {handleIncreaseQuantity, handleDecreaseQuantity} = useCart();

  return (
    <div className="cart-item">
      {/* Imagen + acciones */}
      <div className="image-section">
        <img src={image[0]} alt={model} className="product-image" />
        <div className="actions">   
          {/* Control de cantidad */}
          <div className="quantity-control">
            <button onClick={() => handleDecreaseQuantity(id, size)}>
              <DeleteOutlineIcon fontSize="small" />
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => handleIncreaseQuantity(id, size)}
              disabled={quantity >= stock}
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
        <h3>{model}</h3>
        <p>{brand}</p>
        <p className="size">
          Talle <span>{size}</span>
        </p>
      </div>

      {/* Precio */}
      <div className="price-section" style={{ paddingRight: '20px' }}>
        ${price.toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;