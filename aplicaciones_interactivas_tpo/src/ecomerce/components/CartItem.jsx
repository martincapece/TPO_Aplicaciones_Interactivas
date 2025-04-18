import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

function CartItem({ product }) {
  const { name, type, color, size, price, img, quantity } = product;

  return (
    <div className="cart-item">
      {/* Imagen + acciones */}
      <div className="image-section">
        <img src={img} alt={name} className="product-image" />
        <div className="actions">   
          {/* Control de cantidad */}
          <div className="quantity-control">
            <button><DeleteOutlineIcon fontSize="small" /></button>
            <span>{quantity}</span>
            <button><AddIcon fontSize="small" /></button>
          </div>
        </div>
      </div>

      {/* Info del producto */}
      <div className="info-section">
        <h3>{name}</h3>
        <p>{type}</p>
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