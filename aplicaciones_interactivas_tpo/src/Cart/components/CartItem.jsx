import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../hooks/useCart';

function CartItem({ product }) {
  const { id, model, brand, color = 'red', size = '7', price, image, quantity } = product;

  const {handleIncreaseQuantity, handleDecreaseQuantity} = useCart();


  return (
    <div className="cart-item">
      {/* Imagen + acciones */}
      <div className="image-section">
        <img src={image[0]} alt={model} className="product-image" />
        <div className="actions">   
          {/* Control de cantidad */}
          <div className="quantity-control">
            <button onClick={() => handleDecreaseQuantity(id)}>
              <DeleteOutlineIcon fontSize="small" />
            </button>
            <span>{quantity}</span>
            <button onClick={() => handleIncreaseQuantity(id)}>
              <AddIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>

      {/* Info del producto */}
      <div className="info-section">
        <h3>{model}</h3>
        <p>{brand}</p>
        <p>{color}</p>
        <p className="size">
          Talla <span>{size}</span>
        </p>
      </div>

      {/* Precio */}
      <div className="price-section">
        ${price.toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;