import { useState } from 'react';
import './AddressBook.css';

const AddressForm = ({ address = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: address.name || '',
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    country: address.country || '',
    phone: address.phone || '',
    isDefault: address.isDefault || false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.street || !formData.city || !formData.zipCode) {
      alert('Please fill out all required fields');
      return;
    }
    
    onSave({
      id: address.id || Date.now().toString(),
      ...formData
    });
  };
  
  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="street">Street Address*</label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City*</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="state">State/Province</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zipCode">ZIP/Postal Code*</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="country">Country*</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
        />
        <label htmlFor="isDefault">Set as default address</label>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Address
        </button>
      </div>
    </form>
  );
};

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`address-card ${address.isDefault ? 'default' : ''}`}>
      {address.isDefault && <div className="default-badge">Default</div>}
      
      <div className="address-content">
        <h4>{address.name}</h4>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        {address.phone && <p>Phone: {address.phone}</p>}
      </div>
      
      <div className="address-actions">
        <button className="btn-action" onClick={() => onEdit(address)}>
          Edit
        </button>
        <button className="btn-action delete" onClick={() => onDelete(address.id)}>
          Delete
        </button>
        {!address.isDefault && (
          <button className="btn-action default" onClick={() => onSetDefault(address.id)}>
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
};

const AddressBook = ({ addresses, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };
  
  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };
  
  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      await onUpdate({ addresses: updatedAddresses });
    }
  };
  
  const handleSetDefault = async (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    
    await onUpdate({ addresses: updatedAddresses });
  };
  
  const handleSaveAddress = async (address) => {
    let updatedAddresses;
    
    // If this is set as default, update all other addresses to not be default
    if (address.isDefault) {
      updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    } else {
      updatedAddresses = [...addresses];
    }
    
    // If editing an existing address
    if (editingAddress) {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id === address.id ? address : addr
      );
    } else {
      // If this is the first address, make it default
      if (updatedAddresses.length === 0) {
        address.isDefault = true;
      }
      updatedAddresses.push(address);
    }
    
    const result = await onUpdate({ addresses: updatedAddresses });
    
    if (result.success) {
      setShowForm(false);
      setEditingAddress(null);
    }
  };
  
  return (
    <div className="address-book">
      <div className="address-book-header">
        <h3>Your Addresses</h3>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            Add New Address
          </button>
        )}
      </div>
      
      {showForm ? (
        <AddressForm 
          address={editingAddress} 
          onSave={handleSaveAddress}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="address-list">
          {addresses.length === 0 ? (
            <div className="no-addresses">
              <p>You don't have any saved addresses yet.</p>
            </div>
          ) : (
            addresses.map(address => (
              <AddressCard 
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressBook;