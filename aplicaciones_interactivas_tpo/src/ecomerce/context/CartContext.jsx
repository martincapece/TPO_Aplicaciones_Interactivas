import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [productList, setProductList] = useState([]);

  const addProduct = (product) => {
    setProductList((prev) => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (id) => {
    setProductList((prev) =>
      prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
    );
  };

  const decreaseQuantity = (id) => {
    setProductList((prev) =>
      prev.map(p => p.id === id ? { ...p, quantity: p.quantity - 1 } : p)
          .filter(p => p.quantity > 0)
    );
  };

  const subtotal = productList.reduce((acc, p) => acc + p.price * p.quantity, 0);

  return (
    <CartContext.Provider value={{
      productList,
      addProduct,
      increaseQuantity,
      decreaseQuantity,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};
