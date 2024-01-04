import React, { useState, useEffect } from 'react';
import '../Styles/ShoppingCart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is used for API calls

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
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const storedCartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCartItems(storedCartItems);
  };

  const checkItemAvailability = async () => {
    const storedCartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const updatedCartItems = await Promise.all(storedCartItems.map(async (item) => {
      try {
        const response = await axios.get(`http://localhost:5232/api/item/getItem/${item.GUID}`);
        if (!response.data.IsAvailable) {
          return null; // Item is not available
        }
        return item;
      } catch (error) {
        console.error("Error fetching item:", error);
        return item; // Keep the item in case of a network error
      }
    }));

    const availableItems = updatedCartItems.filter(item => item != null);
    if (availableItems.length !== storedCartItems.length) {
      setCartItems(availableItems);
      sessionStorage.setItem('cart', JSON.stringify(availableItems));
    }
  };

  useEffect(() => {
    checkItemAvailability(); // Check availability when component mounts
  }, []);

  const updateQuantity = async (GUID, newQuantity) => {
    const item = cartItems.find(item => item.GUID === GUID);
    if (!item) {
      console.error('Item not found');
      return;
    }

    const maxQuantity = item.Quantity;
    const safeQuantity = newQuantity > maxQuantity ? maxQuantity : newQuantity;
    const updatedCart = cartItems.map(cartItem => {
      if (cartItem.GUID === GUID) {
        return { ...cartItem, quantityToPurchase: safeQuantity };
      }
      return cartItem;
    });

    setCartItems(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    
  };

  const deleteItem = async (GUID) => {
    const updatedCart = cartItems.filter(item => item.GUID !== GUID);
    setCartItems(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    await checkItemAvailability(); // Check availability after deletion
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.Price * item.quantityToPurchase, 0);
  };

  const navigateToProduct = (GUID) => {
    navigate(`/product/${GUID}`);
  };

  // New function to place the order
  const placeOrder = async () => {
    // Assuming you have a way to get the current user's ID and name
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userName = user.UserName; //
    const UserGUID = user.UserId; //
    if (!user) { console.error('User not found'); return; }

    try {
      const order = {

        UserName: userName,
        UserGUID: UserGUID,
        TotalPrice: calculateTotal(),
        Status: 0, // Assuming you want to set this status when placing the order
        Items: cartItems.map(({ GUID, Title, TitleImageUrl, quantityToPurchase, Price }) => ({
          OriginalItemGUID: GUID,
          Title,
          TitleImageUrl,
          QuantityToPurchase: quantityToPurchase,
          Price
        }))
      };

      const response = await axios.post('http://localhost:5232/api/order/createOrder', order, {withCredentials: true});
      if (response.status === 200) {
        // Handle successful order placement here
        alert(`Order placed! Your order ID is: ${response.data.OrderId}`);
        // Clear the cart after placing the order
        setCartItems([]);
        sessionStorage.removeItem('cart');
        // Maybe navigate to a confirmation page or order summary page
        // navigate('/order-confirmation');
      } else {
        // Handle other statuses
        alert('Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order. Please check your connection and try again.');
    }
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
              <h3 className="cart-item-title" onClick={() => navigateToProduct(item.GUID)}>
                {item.Title}
              </h3>
              <p>Price: ₺{item.Price.toFixed(2)}</p>
              <input
                style={{ width: '40px' }}
                type="number"
                value={item.quantityToPurchase}
                onChange={(e) => updateQuantity(item.GUID, parseInt(e.target.value, 10))}
                min="1"
                max={item.Quantity}
              />
              <button onClick={() => deleteItem(item.GUID)}>Remove</button>
             
            </div>
          ))}

          <div className="cart-total">
            <strong>Total: ₺{calculateTotal().toFixed(2)}</strong>
          </div>
          <button onClick={placeOrder} className="place-order-button">
                Place Order
             </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
