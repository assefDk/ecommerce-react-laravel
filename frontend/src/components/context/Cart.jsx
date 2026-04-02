import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      localStorage.removeItem("cart");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartData));
  }, [cartData]);

  // ✅ إضافة منتج
  const addToCart = (product, size = null) => {
    setCartData((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.product_id === product.id && item.size === size,
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].qty += 1;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            id: `${product.id}-${Date.now()}-${Math.random()}`,
            product_id: product.id,
            size,
            title: product.title,
            price: product.price,
            qty: 1,
            image_url: product.image_url,
          },
        ];
      }
    });
  };

  const shipping = () => {
    return 0;
  };

  const subTotal = () => {
    return cartData.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);
  };

  const grandTotal = () => {
    return subTotal() + shipping();
  };

  const updateCartItem = (itemId, newQty) => {
    const updatedCart = cartData.map((item) =>
      item.id === itemId ? { ...item, qty: parseInt(newQty) || 1 } : item,
    );

    setCartData(updatedCart);
  };

  const deleteCartItem = (itemId) => {
    const newCartDate = cartData.filter((item) => item.id !== itemId);
    setCartData(newCartDate);
    localStorage.setItem("cart", JSON.stringify(newCartDate));
  };

  const getQty = () => {
    let qty = 0;
    cartData.map((item) => {
      qty += parseInt(item.qty);
    });
    return qty;
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        addToCart,
        subTotal,
        grandTotal,
        shipping,
        updateCartItem,
        deleteCartItem,
        getQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
