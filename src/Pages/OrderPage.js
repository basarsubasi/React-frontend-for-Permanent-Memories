import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/OrderPage.css'; // Ensure this file is created and updated with styles

const OrderPage = () => {
    const [order, setOrder] = useState(null);
    const { OrderId } = useParams(); // Assuming you're using React Router and 'orderId' is the URL param
    const OrderStatus = {
        0: 'Pending',
        1: 'Processing',
        2: 'Shipped',
        3: 'Delivered',
        4: 'Cancelled' // Add more statuses as needed
    };
    const getStatusClassName = (status) => {
        switch(status) {
            case 0: // Pending
            case 1: // Processing
            case 2: // Shipped
                return 'status-pending'; // Use the same yellow color for these statuses
            case 3: // Delivered
                return 'status-delivered';
            case 4: // Cancelled
                return 'status-cancelled';
            default:
                return ''; // Default case if status is unknown
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:5232/api/order/getOrder/${OrderId}`, {withCredentials: true});
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
            <h1>Order Details</h1>
            <p>Order ID: {order.OrderId}</p>
            <p>Date Placed: {new Date(order.DatePlaced).toLocaleDateString()}</p>
            <p>Total Price: ₺{order.TotalPrice}</p>
            <p>Status: <span className={getStatusClassName(order.Status)}>{OrderStatus[order.Status]}</span></p>
            <h2>Items</h2>
            <div className="order-items">
                {renderOrderItems()}
            </div>
        </div>
    );
};

export default OrderPage;
