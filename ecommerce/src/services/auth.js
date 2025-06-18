// Authentication service
const USERS_KEY = 'ecommerce_users';
const CURRENT_USER_KEY = 'ecommerce_current_user';

// Get users from localStorage or initialize empty array
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Register a new user
export const register = (name, email, password) => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    throw new Error('Email already registered');
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In a real app, this should be hashed
    createdAt: new Date().toISOString(),
    wishlist: [],
    orders: [],
    addresses: [],
    points: 0
  };
  
  // Add user to users array
  users.push(newUser);
  saveUsers(users);
  
  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Login user
export const login = (email, password) => {
  const users = getUsers();
  
  // Find user by email
  const user = users.find(user => user.email === email);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  // Save current user to localStorage (without password)
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Logout user
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Update user profile
export const updateProfile = (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No user logged in');
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user
  const updatedUser = { ...users[userIndex], ...updates };
  users[userIndex] = updatedUser;
  saveUsers(users);
  
  // Update current user in localStorage
  const { password: _, ...userWithoutPassword } = updatedUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Social media login (mock)
export const socialLogin = (provider) => {
  // This would connect to OAuth providers in a real implementation
  const mockUser = {
    id: `social_${Date.now()}`,
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    email: `user_${Date.now()}@${provider}.com`,
    provider,
    createdAt: new Date().toISOString(),
    wishlist: [],
    orders: [],
    addresses: [],
    points: 0
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
  return mockUser;
};