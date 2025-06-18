import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/storage';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'FaBook',
    color: '#4a90e2',
    isActive: true
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load categories from storage
    const loadCategories = () => {
      const storedCategories = getFromLocalStorage('categories', []);
      setCategories(storedCategories);
    };
    
    loadCategories();
  }, []);
  
  useEffect(() => {
    // Filter and sort categories
    let result = [...categories];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(category => 
        category.name.toLowerCase().includes(query) || 
        category.description.toLowerCase().includes(query)
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
    
    setFilteredCategories(result);
  }, [categories, searchQuery, sortField, sortDirection]);
  
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
  
  const handleAddCategory = () => {
    // Validate form
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }
    
    // Check if name already exists
    if (categories.some(category => category.name.toLowerCase() === newCategory.name.toLowerCase())) {
      toast.error('Category name already exists');
      return;
    }
    
    // Create new category
    const category = {
      id: Date.now().toString(),
      ...newCategory,
      questionCount: 0,
      quizCount: 0,
      dateCreated: new Date().toISOString()
    };
    
    const updatedCategories = [...categories, category];
    saveToLocalStorage('categories', updatedCategories);
    setCategories(updatedCategories);
    
    // Reset form and close modal
    setNewCategory({
      name: '',
      description: '',
      icon: 'FaBook',
      color: '#4a90e2',
      isActive: true
    });
    setShowAddModal(false);
    
    toast.success('Category added successfully');
  };
  
  const handleEditCategory = () => {
    if (!selectedCategory) return;
    
    // Validate form
    if (!selectedCategory.name) {
      toast.error('Category name is required');
      return;
    }
    
    // Check if name already exists (excluding the current category)
    if (categories.some(category => 
      category.id !== selectedCategory.id && 
      category.name.toLowerCase() === selectedCategory.name.toLowerCase()
    )) {
      toast.error('Category name already exists');
      return;
    }
    
    // Update category
    const updatedCategories = categories.map(category => 
      category.id === selectedCategory.id ? selectedCategory : category
    );
    
    saveToLocalStorage('categories', updatedCategories);
    setCategories(updatedCategories);
    setShowEditModal(false);
    
    toast.success('Category updated successfully');
  };
  
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    // Delete category
    const updatedCategories = categories.filter(category => category.id !== selectedCategory.id);
    saveToLocalStorage('categories', updatedCategories);
    setCategories(updatedCategories);
    setShowDeleteModal(false);
    
    toast.success('Category deleted successfully');
  };
  
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };
  
  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <AdminHeader title="Category Management" />
        
        <PageActions>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search categories..."
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
            icon={<FaPlus />}
          >
            Add Category
          </Button>
        </PageActions>
        
        <CategoriesGrid>
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <CategoryCard key={category.id} color={category.color}>
                <CategoryHeader>
                  <CategoryIcon color={category.color}>
                    {/* This is a simplified approach. In a real app, you'd dynamically render icons */}
                    {category.icon.replace('Fa', '')}
                  </CategoryIcon>
                  <CategoryStatus active={category.isActive}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </CategoryStatus>
                </CategoryHeader>
                
                <CategoryName>{category.name}</CategoryName>
                <CategoryDescription>{category.description}</CategoryDescription>
                
                <CategoryStats>
                  <StatItem>
                    <StatLabel>Questions</StatLabel>
                    <StatValue>{category.questionCount}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Quizzes</StatLabel>
                    <StatValue>{category.quizCount}</StatValue>
                  </StatItem>
                </CategoryStats>
                
                <CategoryDate>
                  Created: {new Date(category.dateCreated).toLocaleDateString()}
                </CategoryDate>
                
                <CategoryActions>
                  <ActionButton onClick={() => openEditModal(category)}>
                    <FaEdit />
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => openDeleteModal(category)}>
                    <FaTrash />
                    Delete
                  </ActionButton>
                </CategoryActions>
              </CategoryCard>
            ))
          ) : (
            <EmptyState>
              <EmptyMessage>No categories found</EmptyMessage>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                icon={<FaPlus />}
              >
                Add Category
              </Button>
            </EmptyState>
          )}
        </CategoriesGrid>
        
        {/* Add Category Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Category"
        >
          <FormGroup>
            <FormLabel>Category Name</FormLabel>
            <FormInput
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              placeholder="Enter category name"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              placeholder="Enter category description"
              rows={3}
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <FormLabel>Icon</FormLabel>
              <FormSelect
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
              >
                <option value="FaBook">Book</option>
                <option value="FaFlask">Science</option>
                <option value="FaGlobe">Geography</option>
                <option value="FaLandmark">History</option>
                <option value="FaMusic">Music</option>
                <option value="FaFilm">Movies</option>
                <option value="FaFootballBall">Sports</option>
                <option value="FaPalette">Art</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Color</FormLabel>
              <ColorPickerContainer>
                <ColorPreview color={newCategory.color} />
                <ColorInput
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                />
              </ColorPickerContainer>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <FormCheckboxLabel>
              <FormCheckbox
                type="checkbox"
                checked={newCategory.isActive}
                onChange={(e) => setNewCategory({...newCategory, isActive: e.target.checked})}
              />
              Active
            </FormCheckboxLabel>
          </FormGroup>
          
          <ModalActions>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Add Category
            </Button>
          </ModalActions>
        </Modal>
        
        {/* Edit Category Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Category"
        >
          {selectedCategory && (
            <>
              <FormGroup>
                <FormLabel>Category Name</FormLabel>
                <FormInput
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                  placeholder="Enter category description"
                  rows={3}
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Icon</FormLabel>
                  <FormSelect
                    value={selectedCategory.icon}
                    onChange={(e) => setSelectedCategory({...selectedCategory, icon: e.target.value})}
                  >
                    <option value="FaBook">Book</option>
                    <option value="FaFlask">Science</option>
                    <option value="FaGlobe">Geography</option>
                    <option value="FaLandmark">History</option>
                    <option value="FaMusic">Music</option>
                    <option value="FaFilm">Movies</option>
                    <option value="FaFootballBall">Sports</option>
                    <option value="FaPalette">Art</option>
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Color</FormLabel>
                  <ColorPickerContainer>
                    <ColorPreview color={selectedCategory.color} />
                    <ColorInput
                      type="color"
                      value={selectedCategory.color}
                      onChange={(e) => setSelectedCategory({...selectedCategory, color: e.target.value})}
                    />
                  </ColorPickerContainer>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormCheckboxLabel>
                  <FormCheckbox
                    type="checkbox"
                    checked={selectedCategory.isActive}
                    onChange={(e) => setSelectedCategory({...selectedCategory, isActive: e.target.checked})}
                  />
                  Active
                </FormCheckboxLabel>
              </FormGroup>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditCategory}>
                  Save Changes
                </Button>
              </ModalActions>
            </>
          )}
        </Modal>
        
        {/* Delete Category Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Category"
        >
          {selectedCategory && (
            <>
              <ConfirmationMessage>
                Are you sure you want to delete the category <strong>{selectedCategory.name}</strong>?
                This will also delete all associated quizzes and questions.
                This action cannot be undone.
              </ConfirmationMessage>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="error" onClick={handleDeleteCategory}>
                  Delete Category
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${props => props.color || props.theme.primary};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => `${props.color}20` || `${props.theme.primary}20`};
  color: ${props => props.color || props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const CategoryStatus = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => props.active ? `
    background-color: ${props.theme.success}20;
    color: ${props.theme.success};
  ` : `
    background-color: ${props.theme.error}20;
    color: ${props.theme.error};
  `}
`;

const CategoryName = styled.h3`
  margin: 0;
  padding: 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  margin: 0.5rem 0 1rem;
  padding: 0 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CategoryStats = styled.div`
  display: flex;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 4px;
  margin-right: 0.5rem;
  
  &:last-child {
    margin-right: 0;
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const CategoryDate = styled.div`
  padding: 0 1rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const CategoryActions = styled.div`
  display: flex;
  border-top: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    color: ${props => props.theme.primary};
  }
  
  &:last-child:hover {
    color: ${props => props.theme.error};
  }
  
  &:not(:last-child) {
    border-right: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 1.5rem;
`;

const EmptyMessage = styled.div`
  font-size: 1.1rem;
  opacity: 0.7;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  resize: vertical;
  
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

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColorPreview = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
  }
`;

const FormCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const FormCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
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

export default AdminCategories;