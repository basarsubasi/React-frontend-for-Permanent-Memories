import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../Styles/MyOrders.css'; // Ensure you have the CSS for styling

const MyOrders = ({ }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const UserGUID = user.UserId; //
    const OrderStatus = {
        0: 'Pending',
        1: 'Processing',
        2: 'Shipped',
        3: 'Delivered',
        4: 'Cancelled'
      };
      const navigate = useNavigate();
      const goToOrderDetails = (OrderId) => {
        navigate(`/orderpage/${OrderId}`);
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
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5232/api/order/listUserOrders`, {
                    params: { UserGUID },
                    withCredentials: true
                });
                setOrders(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [UserGUID]);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (orders.length === 0) {
        return <div>You have no orders.</div>;
    }

    return (
        <div className="my-orders">
        <h1>My Orders</h1>
        {orders.map((order) => (
    <div key={order.OrderId} className="order"> {/* Make sure OrderId is the correct unique key field */}
        <div>Order ID: {order.OrderId}</div>
        <div>Date Placed: {order.DatePlaced ? new Date(order.DatePlaced).toLocaleDateString() : 'N/A'}</div>
        <div>Total Price: ₺{order.TotalPrice}</div>
        <p>Status: <span className={getStatusClassName(order.Status)}>{OrderStatus[order.Status]}</span></p>
        <button onClick={() => goToOrderDetails(order.OrderId)} className="details-button">
            Details
        </button>
        {/* Add more order details as needed */}
            </div>
           ))}           
 </div>
);
};

export default MyOrders;
