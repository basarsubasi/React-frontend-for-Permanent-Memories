// OrderConfirmation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/OrderConfirmation.css'; // You can reuse the same styles as OrderPage

const OrderConfirmation = () => {
    const [order, setOrder] = useState(null);
    const { OrderId } = useParams(); // Assuming you're using React Router and 'OrderId' is the URL param

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:5232/api/order/getOrder/${OrderId}`, { withCredentials: true });
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
                // Handle error - maybe set an error state and show an error message?
            }
        };

        if (OrderId) {
            fetchOrder();
        }
    }, [OrderId]);

    if (!order) {
        return <div>Loading order details...</div>; // or some loading spinner
    }

    // Function to render order items
    const renderOrderItems = () => {
        return order.Items.map((item, index) => (
            <div key={index} className="order-item">
                <img src={item.TitleImageUrl} alt={item.Title} className="order-item-image" />
                <div className="order-item-details">
                    <h3>{item.Title}</h3>
                    <p>Quantity: {item.QuantityToPurchase}</p>
                    <p>Price: ₺{item.Price}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="order-page">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
            <h2>Order Details</h2>
            <p>Order ID: {order.OrderId}</p>
            <p>Date Placed: {new Date(order.DatePlaced).toLocaleDateString()}</p>
            <p>Total Price: ₺{order.TotalPrice}</p>
            <h2>Items</h2>
            <div className="order-items">
                {renderOrderItems()}
            </div>
        </div>
    );
};

export default OrderConfirmation;
