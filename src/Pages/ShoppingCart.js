import React, { useState, useEffect } from 'react';
import '../Styles/ShoppingCart.css';

export const addToCart = (newItem) => {
    // Get the current cart from session storage or initialize with an empty array
    const currentCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  
    // Check if the item already exists in the cart
    const existingItemIndex = currentCart.findIndex(item => item.GUID === newItem.GUID);
  
    // Update the cart accordingly
    if (existingItemIndex > -1) {
      // If item exists, update its quantity
      currentCart[existingItemIndex].quantityToPurchase += newItem.quantityToPurchase;
    } else {
      // If item doesn't exist, add the new item
      currentCart.push(newItem);
    }
  
    // Save the updated cart to session storage
    sessionStorage.setItem('cart', JSON.stringify(currentCart));
  };

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

  const updateQuantity = (GUID, newQuantity) => {
    let updatedCart = cartItems.map(item => {
      if (item.GUID === GUID) {
        return { ...item, quantityToPurchase: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const deleteItem = (GUID) => {
    let updatedCart = cartItems.filter(item => item.GUID !== GUID);
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
              <input  style={{ width: '40px' }}
                type="number" 
                value={item.quantityToPurchase} 
                onChange={(e) => updateQuantity(item.GUID, parseInt(e.target.value, 10))}
                min="1"
              />
              <button onClick={() => deleteItem(item.GUID)}>Remove</button>
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
