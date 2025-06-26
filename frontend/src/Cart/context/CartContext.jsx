import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
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
  const processCheckout = async (idCliente, medioPago) => {
    try {
      const items = productList.map(product => ({
        sku: product.id,
        talle: product.size,
        cantidad: product.quantity,
      }));

      const compraRequest = {
        idCliente,
        medioPago,
        items,
      };

      const response = await fetch('http://localhost:8080/sapah/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compraRequest),
      });

      if (response.ok) {
        const compraCreada = await response.json();
        console.log('Compra creada exitosamente:', compraCreada);
        resetCart();
        return compraCreada;
      } else {
        throw new Error('Error al procesar la compra');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      throw error;
    }
  };

  // ✅ Aquí decidimos si usamos `price` o `precio`
  const subtotal = productList.reduce((acc, p) => acc + p.price * p.quantity, 0);

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
