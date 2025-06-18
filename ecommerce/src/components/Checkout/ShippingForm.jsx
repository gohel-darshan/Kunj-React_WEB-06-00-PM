import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ShippingForm.css';

const ShippingForm = ({ initialValues, onSubmit, user }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    saveAddress: false
  });
  
  const [errors, setErrors] = useState({});
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('new');
  
  useEffect(() => {
    // Set initial values if provided
    if (initialValues) {
      setFormValues(initialValues);
    }
    
    // Get user addresses if available
    if (user && user.addresses && user.addresses.length > 0) {
      setUserAddresses(user.addresses);
      setSelectedAddress(
        user.addresses.find(addr => addr.isDefault)?.id || 
        user.addresses[0].id
      );
    }
  }, [initialValues, user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    setSelectedAddress(addressId);
    
    if (addressId === 'new') {
      // Reset form for new address
      setFormValues({
        ...formValues,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
    } else {
      // Fill form with selected address
      const selectedAddr = userAddresses.find(addr => addr.id === addressId);
      if (selectedAddr) {
        const nameParts = selectedAddr.name.split(' ');
        setFormValues({
          ...formValues,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: selectedAddr.phone || '',
          address: selectedAddr.street,
          city: selectedAddr.city,
          state: selectedAddr.state,
          zipCode: selectedAddr.zipCode,
          country: selectedAddr.country,
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formValues.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formValues.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formValues.email.trim()) newErrors.email = 'Email is required';
    if (!formValues.address.trim()) newErrors.address = 'Address is required';
    if (!formValues.city.trim()) newErrors.city = 'City is required';
    if (!formValues.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formValues.country.trim()) newErrors.country = 'Country is required';
    
    // Email validation
    if (formValues.email && !/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formValues);
    }
  };
  
  return (
    <div className="shipping-form-container">
      <h2 className="form-title">Shipping Information</h2>
      
      {!user && (
        <div className="login-prompt">
          <p>Already have an account? <Link to="/login">Log in</Link> for faster checkout.</p>
        </div>
      )}
      
      {userAddresses.length > 0 && (
        <div className="saved-addresses">
          <h3>Your Addresses</h3>
          <div className="address-selector">
            <select 
              value={selectedAddress} 
              onChange={handleAddressSelect}
              className="address-select"
            >
              {userAddresses.map(address => (
                <option key={address.id} value={address.id}>
                  {address.name} - {address.street}, {address.city}
                </option>
              ))}
              <option value="new">Use a new address</option>
            </select>
          </div>
        </div>
      )}
      
      <form className="shipping-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address*</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formValues.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="state">State/Province</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formValues.state}
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
              value={formValues.zipCode}
              onChange={handleChange}
              className={errors.zipCode ? 'error' : ''}
            />
            {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country*</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formValues.country}
              onChange={handleChange}
              className={errors.country ? 'error' : ''}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>
        </div>
        
        {user && selectedAddress === 'new' && (
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="saveAddress"
              name="saveAddress"
              checked={formValues.saveAddress}
              onChange={handleChange}
            />
            <label htmlFor="saveAddress">Save this address to your account</label>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;