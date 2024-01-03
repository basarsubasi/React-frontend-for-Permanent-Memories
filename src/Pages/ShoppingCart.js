import React, { useState, useEffect } from 'react';
import '../Styles/ShoppingCart.css';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from session storage on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const storedCartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCartItems(storedCartItems);
  };

  const updateQuantity = (guid, newQuantity) => {
    let updatedCart = cartItems.map(item => {
      if (item.guid === guid) {
        return { ...item, quantityToPurchase: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const deleteItem = (guid) => {
    let updatedCart = cartItems.filter(item => item.guid !== guid);
    setCartItems(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

   // Calculate the total price
   const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.Price * item.quantityToPurchase;
    }, 0);
  };

  return (
    <div className="shopping-cart-container">
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.GUID} className="cart-item">
              <img src={item.TitleImageUrl} alt={item.Title} />
              <h3>{item.Title}</h3>
              <p>Price: ₺{item.Price.toFixed(2)}
              </p>
              <input 
                type="number" 
                value={item.quantityToPurchase} 
                onChange={(e) => updateQuantity(item.guid, parseInt(e.target.value, 10))}
                min="1"
              />
              <button onClick={() => deleteItem(item.guid)}>Remove</button>
            </div>
          ))}

            <div className="cart-total">
            <strong>Total: ₺{calculateTotal().toFixed(2)}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
