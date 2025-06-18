import { useState } from 'react';
import './OrderHistory.css';

// This is a mock order history component
// In a real application, you would fetch this data from your backend API

const mockOrders = [
  {
    id: 'ORD-12345',
    date: '2023-05-15T10:30:00Z',
    total: 129.99,
    status: 'Delivered',
    items: [
      { id: 1, name: 'Wireless Headphones', price: 79.99, quantity: 1, image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg' },
      { id: 2, name: 'T-Shirt', price: 25.00, quantity: 2, image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg' }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    trackingNumber: 'TRK9876543210'
  },
  {
    id: 'ORD-67890',
    date: '2023-04-02T14:20:00Z',
    total: 49.95,
    status: 'Delivered',
    items: [
      { id: 3, name: 'External Hard Drive', price: 49.95, quantity: 1, image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg' }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    trackingNumber: 'TRK1234567890'
  },
  {
    id: 'ORD-54321',
    date: '2023-06-20T09:15:00Z',
    total: 159.95,
    status: 'Processing',
    items: [
      { id: 4, name: 'Smart Watch', price: 159.95, quantity: 1, image: 'https://fakestoreapi.com/img/71Swqqe7XAL._AC_SX466_.jpg' }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  }
];

const OrderCard = ({ order, onViewDetails }) => {
  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <div className="order-id">Order #{order.id}</div>
          <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
        </div>
        <div className={`order-status ${order.status.toLowerCase()}`}>
          {order.status}
        </div>
      </div>
      
      <div className="order-items-preview">
        {order.items.slice(0, 3).map(item => (
          <div key={item.id} className="item-preview">
            <img src={item.image} alt={item.name} />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="item-preview more">
            +{order.items.length - 3}
          </div>
        )}
      </div>
      
      <div className="order-footer">
        <div className="order-total">
          Total: ${order.total.toFixed(2)}
        </div>
        <button 
          className="btn-view-details" 
          onClick={() => onViewDetails(order)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const OrderDetails = ({ order, onClose }) => {
  return (
    <div className="order-details-overlay">
      <div className="order-details">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="order-details-header">
          <h3>Order Details</h3>
          <div className="order-meta">
            <div className="order-id">Order #{order.id}</div>
            <div className="order-date">Placed on {new Date(order.date).toLocaleDateString()}</div>
            <div className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </div>
          </div>
        </div>
        
        <div className="order-section">
          <h4>Items</h4>
          <div className="order-items-list">
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-quantity">Qty: {item.quantity}</div>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-sections-container">
          <div className="order-section shipping">
            <h4>Shipping Address</h4>
            <div className="address-details">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            
            {order.trackingNumber && (
              <div className="tracking-info">
                <h5>Tracking Number</h5>
                <p>{order.trackingNumber}</p>
                <button className="btn-track">Track Package</button>
              </div>
            )}
          </div>
          
          <div className="order-section payment">
            <h4>Order Summary</h4>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-actions">
          <button className="btn-support">Need Help?</button>
          {order.status === 'Delivered' && (
            <button className="btn-primary">Write a Review</button>
          )}
          {order.status === 'Processing' && (
            <button className="btn-outline">Cancel Order</button>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // In a real app, you would fetch orders from your API
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     const response = await fetch('/api/orders');
  //     const data = await response.json();
  //     setOrders(data);
  //   };
  //   fetchOrders();
  // }, [user.id]);
  
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter);
  
  return (
    <div className="order-history">
      <div className="order-history-header">
        <h3>Order History</h3>
        <div className="order-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button 
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>
      
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found for this filter.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={setSelectedOrder}
            />
          ))
        )}
      </div>
      
      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderHistory;