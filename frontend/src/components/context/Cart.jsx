import { createContext, useState, useEffect } from "react";
import { apiUrl, userToken } from "../common/http";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [shippingCost, setShippingCost] = useState(0);
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
    let shippingCharge = 0;
    cartData.map((item) => {
      shippingCharge += shippingCost * item.qty;
    });

    return shippingCharge;
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

  useEffect(() => {
    fetch(`${apiUrl}/get-shipping`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status == 200) {
          setShippingCost(result.data.shipping_charge);
        } else {
          setShippingCost(0);
          console.log("something went wrong");
        }
      });
  });

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
