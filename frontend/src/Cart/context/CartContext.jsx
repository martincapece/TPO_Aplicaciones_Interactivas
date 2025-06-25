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
        return prev.map(p => (
          p.id === product.id && p.size === product.size 
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

  const resetCart = () => {
    setProductList([]);
    localStorage.removeItem('cart');
  }

  // Función para procesar la compra
const processCheckout = async (idCliente, medioPago) => {
  try {
    // Transformar datos del carrito al formato esperado por el backend
    const items = productList.map(product => ({
      sku: product.id, // mapear id a sku
      talle: product.size, // mapear size a talle
      cantidad: product.quantity // mapear quantity a cantidad
    }));

    const compraRequest = {
      idCliente: idCliente,
      medioPago: medioPago,
      items: items
    };

    const response = await fetch('http://localhost:8080/sapah/compras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(compraRequest)
    });

    if (response.ok) {
      const compraCreada = await response.json();
      console.log('Compra creada exitosamente:', compraCreada);
      
      // Resetear carrito después de compra exitosa
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