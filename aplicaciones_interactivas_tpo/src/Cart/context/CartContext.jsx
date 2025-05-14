import { createContext, useEffect, useState } from 'react';

//crea el contexto
export const CartContext = createContext();

// crea el provider
export const CartProvider = ({ children }) => {
  const [productList, setProductList] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(productList));
  }, [productList]);

  const addProduct = (product) => {
    setProductList((prev) => {
      const existing = prev.find(p => p.id === product.id && p.size === product.size);
      if (existing) {
        return prev.map(p => (p.id === product.id && p.size === product.size ? { ...p, quantity: p.quantity + 1 } : p));
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (productId, size) => {
    setProductList(prev =>
      prev.map(item =>
        item.id === productId && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (productId, size) => {
    setProductList((prev) =>
      prev.map(item => item.id === productId && item.size === size ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const subtotal = productList.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const cartSize = productList.length;

  return (
    <CartContext.Provider value={{
      productList,
      addProduct,
      handleIncreaseQuantity,
      handleDecreaseQuantity,
      subtotal,
      cartSize
    }}>
      {children}
    </CartContext.Provider>
  );
};
