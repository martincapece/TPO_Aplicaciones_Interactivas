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
      const existing = prev.find(p => p.sku === product.sku && p.numeroProducto === product.numeroProducto);
      if (existing) {
        return prev.map(p => (
          p.sku === product.sku && p.numeroProducto === product.numeroProducto
          ? ( p.quantity + 1 <= p.stock )
            ? { ...p, quantity: p.quantity + 1 }
            : { ...p, quantity: p.quantity }
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
      prev.map(item => item.sku === sku && item.numeroProducto === numeroProducto ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const discountStock = async(productId, tallesAActualizar) => {
    debugger
     try {
      // 1. Traer el producto completo
      const res = await fetch(`http://localhost:3000/data/${productId}`);
      const product = await res.json();

      // 2. Crear nuevo array de talles con el stock actualizado
      const updatedSizes = product.sizes.map((s) => {
        const encontrado = tallesAActualizar.find(t => String(t.size) === String(s.size));
        if (encontrado) {
          return {
            ...s,
            stock: s.stock - encontrado.quantity
          };
        }
        return s;
      });

      // 3. Enviar el producto actualizado al servidor
      const updatedProduct = { ...product, sizes: updatedSizes };

      await fetch(`http://localhost:3000/data/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });

      console.log(`Stock actualizado para producto ${productId}`);
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
    }
  };

  const resetCart = () => {
    setProductList([]);
    localStorage.removeItem('cart');
  }

  const subtotal = productList.reduce((acc, p) => acc + p.precio * p.quantity, 0);

  const cartSize = productList.length;

  return (
    <CartContext.Provider value={{
      productList,
      addProduct,
      handleIncreaseQuantity,
      handleDecreaseQuantity,
      discountStock,
      resetCart,
      subtotal,
      cartSize
    }}>
      {children}
    </CartContext.Provider>
  );
};
