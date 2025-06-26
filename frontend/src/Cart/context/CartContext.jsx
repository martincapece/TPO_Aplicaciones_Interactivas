import { createContext, useContext, useEffect, useState } from 'react';
import { ProductosContext } from '../../ecomerce/context/ProductosContext'; // ✅ AGREGAR

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ AGREGAR: Obtener función para actualizar stock
  const { actualizarStockPorCompra } = useContext(ProductosContext);

  const [productList, setProductList] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(productList));
  }, [productList]);

  const addProduct = (product) => {
    setProductList((prev) => {
      const existing = prev.find(p => p.sku === product.sku && p.numeroProducto === product.numeroProducto);
      if (existing) {
        return prev.map(p => (
            p.sku === product.sku && p.numeroProducto === product.numeroProducto
                ? (p.quantity + 1 <= p.stock) ? { ...p, quantity: p.quantity + 1 } : { ...p, quantity: p.quantity }
                : p
        ));
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (sku, numeroProducto) => {
    setProductList(prev =>
        prev.map(item =>
            item.sku === sku && item.numeroProducto === numeroProducto ? { ...item, quantity: item.quantity + 1 } : item
        )
    );
  };

  const handleDecreaseQuantity = (sku, numeroProducto) => {
    setProductList((prev) =>
        prev
            .map(item =>
                item.sku === sku && item.numeroProducto === numeroProducto
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter(item => item.quantity > 0)
    );
  };

  const resetCart = () => {
    setProductList([]);
    localStorage.removeItem('cart');
  };

  // ✅ Aquí mantenemos la lógica de processCheckout
  const processCheckout = async (idUsuario, token, medioPago) => {
    try {
      const items = productList.map(product => ({
        sku: product.sku,
        talle: product.numeroProducto,
        cantidad: product.quantity,
      }));

      const compraRequest = {
        idCliente: idUsuario,
        medioPago,
        items,
      };

      // ✅ 1. Hacer request a la API
      const response = await fetch('http://localhost:8080/sapah/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(compraRequest),
      });

      if (response.ok) {
        const compraCreada = await response.json();
        
        // ✅ 2. Actualizar stock local para cambio inmediato
        if (actualizarStockPorCompra) {
          actualizarStockPorCompra(items);
        }
        
        return compraCreada;
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      throw error;
    }
  };

  // ✅ Aquí decidimos si usamos `price` o `precio`
  const subtotal = productList.reduce((acc, p) => acc + p.precio * p.quantity, 0);

  const cartSize = productList.length;

  return (
      <CartContext.Provider value={{
        productList,
        addProduct,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        resetCart,
        subtotal,
        cartSize,
        processCheckout
      }}>
        {children}
      </CartContext.Provider>
  );
};
