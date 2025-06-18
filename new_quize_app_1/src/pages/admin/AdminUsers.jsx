import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/storage';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load users from storage
    const loadUsers = () => {
      const storedUsers = getFromLocalStorage('users', []);
      
      // If no users exist, create some sample users
      if (storedUsers.length === 0) {
        const sampleUsers = [
          {
            id: '1',
            username: 'admin',
            email: 'admin@quizmaster.com',
            role: 'admin',
            status: 'active',
            quizzesTaken: 15,
            dateJoined: '2023-01-15T10:30:00Z'
          },
          {
            id: '2',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'user',
            status: 'active',
            quizzesTaken: 8,
            dateJoined: '2023-02-20T14:45:00Z'
          },
          {
            id: '3',
            username: 'jane_smith',
            email: 'jane@example.com',
            role: 'moderator',
            status: 'active',
            quizzesTaken: 12,
            dateJoined: '2023-03-10T09:15:00Z'
          },
          {
            id: '4',
            username: 'bob_johnson',
            email: 'bob@example.com',
            role: 'user',
            status: 'inactive',
            quizzesTaken: 3,
            dateJoined: '2023-04-05T16:20:00Z'
          }
        ];
        
        saveToLocalStorage('users', sampleUsers);
        setUsers(sampleUsers);
      } else {
        setUsers(storedUsers);
      }
    };
    
    loadUsers();
  }, []);
  
  useEffect(() => {
    // Filter and sort users
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle string comparison
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredUsers(result);
  }, [users, searchQuery, sortField, sortDirection]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleAddUser = () => {
    // Validate form
    if (!newUser.username || !newUser.email) {
      toast.error('Username and email are required');
      return;
    }
    
    // Check if username already exists
    if (users.some(user => user.username === newUser.username)) {
      toast.error('Username already exists');
      return;
    }
    
    // Create new user
    const user = {
      id: Date.now().toString(),
      ...newUser,
      quizzesTaken: 0,
      dateJoined: new Date().toISOString()
    };
    
    const updatedUsers = [...users, user];
    saveToLocalStorage('users', updatedUsers);
    setUsers(updatedUsers);
    
    // Reset form and close modal
    setNewUser({
      username: '',
      email: '',
      role: 'user',
      status: 'active'
    });
    setShowAddModal(false);
    
    toast.success('User added successfully');
  };
  
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // Validate form
    if (!selectedUser.username || !selectedUser.email) {
      toast.error('Username and email are required');
      return;
    }
    
    // Update user
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    );
    
    saveToLocalStorage('users', updatedUsers);
    setUsers(updatedUsers);
    setShowEditModal(false);
    
    toast.success('User updated successfully');
  };
  
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Delete user
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    saveToLocalStorage('users', updatedUsers);
    setUsers(updatedUsers);
    setShowDeleteModal(false);
    
    toast.success('User deleted successfully');
  };
  
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <AdminHeader title="User Management" />
        
        <PageActions>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchContainer>
          
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            icon={<FaUserPlus />}
          >
            Add User
          </Button>
        </PageActions>
        
        <UsersTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('username')}>
                Username
                <SortIcon active={sortField === 'username'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('email')}>
                Email
                <SortIcon active={sortField === 'email'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('role')}>
                Role
                <SortIcon active={sortField === 'role'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('status')}>
                Status
                <SortIcon active={sortField === 'status'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('quizzesTaken')}>
                Quizzes Taken
                <SortIcon active={sortField === 'quizzesTaken'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('dateJoined')}>
                Date Joined
                <SortIcon active={sortField === 'dateJoined'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role}>{user.role}</RoleBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status}>
                      {user.status === 'active' ? <FaCheck /> : <FaTimes />}
                      {user.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{user.quizzesTaken}</TableCell>
                  <TableCell>{new Date(user.dateJoined).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton onClick={() => openEditModal(user)}>
                        <FaEdit />
                      </ActionButton>
                      <ActionButton onClick={() => openDeleteModal(user)}>
                        <FaTrash />
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <EmptyCell colSpan={7}>No users found</EmptyCell>
              </TableRow>
            )}
          </TableBody>
        </UsersTable>
        
        {/* Add User Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New User"
        >
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormInput
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              placeholder="Enter username"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="Enter email"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Role</FormLabel>
            <FormSelect
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Status</FormLabel>
            <FormSelect
              value={newUser.status}
              onChange={(e) => setNewUser({...newUser, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormGroup>
          
          <ModalActions>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          </ModalActions>
        </Modal>
        
        {/* Edit User Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit User"
        >
          {selectedUser && (
            <>
              <FormGroup>
                <FormLabel>Username</FormLabel>
                <FormInput
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                  placeholder="Enter username"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormInput
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  placeholder="Enter email"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Role</FormLabel>
                <FormSelect
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Status</FormLabel>
                <FormSelect
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
              </FormGroup>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditUser}>
                  Save Changes
                </Button>
              </ModalActions>
            </>
          )}
        </Modal>
        
        {/* Delete User Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete User"
        >
          {selectedUser && (
            <>
              <ConfirmationMessage>
                Are you sure you want to delete the user <strong>{selectedUser.username}</strong>?
                This action cannot be undone.
              </ConfirmationMessage>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="error" onClick={handleDeleteUser}>
                  Delete User
                </Button>
              </ModalActions>
            </>
          )}
        </Modal>
      </MainContent>
    </AdminLayout>
  );
};

const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: ${props => props.theme.isDark ? '#1a1a1a' : '#f5f7fa'};
  overflow-y: auto;
`;

const PageActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'};
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const SortIcon = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  opacity: ${props => props.active ? 1 : 0.3};
  transform: ${props => props.active && props.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

const EmptyCell = styled.td`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.role) {
      case 'admin':
        return `
          background-color: ${props.theme.primary}20;
          color: ${props.theme.primary};
        `;
      case 'moderator':
        return `
          background-color: ${props.theme.warning}20;
          color: ${props.theme.warning};
        `;
      default:
        return `
          background-color: ${props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          color: ${props.theme.text};
        `;
    }
  }}
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background-color: ${props.theme.success}20;
          color: ${props.theme.success};
        `;
      default:
        return `
          background-color: ${props.theme.error}20;
          color: ${props.theme.error};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.theme.primary};
  }
  
  &:last-child:hover {
    color: ${props => props.theme.error};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const ConfirmationMessage = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export default AdminUsers;