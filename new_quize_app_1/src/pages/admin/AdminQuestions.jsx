import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSort, FaEye, FaFileImport, FaFileExport } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/storage';
import { logAdminActivity } from '../../utils/adminAuth';
import { useQuiz } from '../../contexts/QuizContext';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortField, setSortField] = useState('text');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    categoryId: '',
    difficulty: 'medium',
    type: 'multiple',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  
  const navigate = useNavigate();
  const { username } = useQuiz();
  
  useEffect(() => {
    // Load categories
    const storedCategories = getFromLocalStorage('categories', []);
    setCategories(storedCategories);
    
    // Load questions
    const loadQuestions = () => {
      const storedQuestions = getFromLocalStorage('questions', []);
      setQuestions(storedQuestions);
    };
    
    loadQuestions();
    
    // Log admin activity
    logAdminActivity(username, 'view_questions');
  }, [username]);
  
  useEffect(() => {
    // Filter and sort questions
    let result = [...questions];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(question => 
        question.text.toLowerCase().includes(query) || 
        question.explanation.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(question => question.categoryId === categoryFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter(question => question.difficulty === difficultyFilter);
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
    
    setFilteredQuestions(result);
  }, [questions, searchQuery, categoryFilter, difficultyFilter, sortField, sortDirection]);
  
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
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  const handleAddQuestion = () => {
    // Validate form
    if (!newQuestion.text || !newQuestion.categoryId) {
      toast.error('Question text and category are required');
      return;
    }
    
    if (newQuestion.type === 'multiple' && newQuestion.options.some(option => !option)) {
      toast.error('All options must be filled');
      return;
    }
    
    // Create new question
    const question = {
      id: Date.now().toString(),
      ...newQuestion,
      dateCreated: new Date().toISOString()
    };
    
    const updatedQuestions = [...questions, question];
    saveToLocalStorage('questions', updatedQuestions);
    setQuestions(updatedQuestions);
    
    // Reset form and close modal
    setNewQuestion({
      text: '',
      categoryId: '',
      difficulty: 'medium',
      type: 'multiple',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setShowAddModal(false);
    
    // Log admin activity
    logAdminActivity(username, 'add_question', { questionId: question.id });
    
    toast.success('Question added successfully');
  };
  
  const handleEditQuestion = () => {
    if (!selectedQuestion) return;
    
    // Validate form
    if (!selectedQuestion.text || !selectedQuestion.categoryId) {
      toast.error('Question text and category are required');
      return;
    }
    
    if (selectedQuestion.type === 'multiple' && selectedQuestion.options.some(option => !option)) {
      toast.error('All options must be filled');
      return;
    }
    
    // Update question
    const updatedQuestions = questions.map(question => 
      question.id === selectedQuestion.id ? selectedQuestion : question
    );
    
    saveToLocalStorage('questions', updatedQuestions);
    setQuestions(updatedQuestions);
    setShowEditModal(false);
    
    // Log admin activity
    logAdminActivity(username, 'edit_question', { questionId: selectedQuestion.id });
    
    toast.success('Question updated successfully');
  };
  
  const handleDeleteQuestion = () => {
    if (!selectedQuestion) return;
    
    // Delete question
    const updatedQuestions = questions.filter(question => question.id !== selectedQuestion.id);
    saveToLocalStorage('questions', updatedQuestions);
    setQuestions(updatedQuestions);
    setShowDeleteModal(false);
    
    // Log admin activity
    logAdminActivity(username, 'delete_question', { questionId: selectedQuestion.id });
    
    toast.success('Question deleted successfully');
  };
  
  const handleOptionChange = (index, value, isEdit = false) => {
    if (isEdit) {
      const updatedOptions = [...selectedQuestion.options];
      updatedOptions[index] = value;
      setSelectedQuestion({...selectedQuestion, options: updatedOptions});
    } else {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({...newQuestion, options: updatedOptions});
    }
  };
  
  const handleTypeChange = (type, isEdit = false) => {
    if (isEdit) {
      const updatedOptions = type === 'boolean' ? ['False', 'True'] : ['', '', '', ''];
      setSelectedQuestion({
        ...selectedQuestion, 
        type, 
        options: updatedOptions,
        correctAnswer: 0
      });
    } else {
      const updatedOptions = type === 'boolean' ? ['False', 'True'] : ['', '', '', ''];
      setNewQuestion({
        ...newQuestion, 
        type, 
        options: updatedOptions,
        correctAnswer: 0
      });
    }
  };
  
  const openViewModal = (question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
  };
  
  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };
  
  const exportQuestions = () => {
    // Create a JSON file with the questions
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create a link and click it to download the file
    const exportFileDefaultName = 'questions.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Log admin activity
    logAdminActivity(username, 'export_questions');
    
    toast.success('Questions exported successfully');
  };
  
  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <AdminHeader title="Question Management" />
        
        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchContainer>
          
          <FilterGroup>
            <FilterLabel>
              <FaFilter /> Category
            </FilterLabel>
            <Select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>
              <FaFilter /> Difficulty
            </FilterLabel>
            <Select 
              value={difficultyFilter} 
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </FilterGroup>
        </FiltersContainer>
        
        <ActionButtons>
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            icon={<FaPlus />}
          >
            Add Question
          </Button>
          <Button 
            variant="secondary" 
            onClick={exportQuestions}
            icon={<FaFileExport />}
          >
            Export Questions
          </Button>
        </ActionButtons>
        
        <QuestionsTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('text')}>
                Question
                <SortIcon active={sortField === 'text'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('categoryId')}>
                Category
                <SortIcon active={sortField === 'categoryId'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('difficulty')}>
                Difficulty
                <SortIcon active={sortField === 'difficulty'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('type')}>
                Type
                <SortIcon active={sortField === 'type'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('dateCreated')}>
                Date Created
                <SortIcon active={sortField === 'dateCreated'} direction={sortDirection}>
                  <FaSort />
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map(question => (
                <TableRow key={question.id}>
                  <TableCell>
                    <QuestionText>{question.text}</QuestionText>
                  </TableCell>
                  <TableCell>{getCategoryName(question.categoryId)}</TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={question.difficulty}>
                      {question.difficulty}
                    </DifficultyBadge>
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={question.type}>
                      {question.type === 'multiple' ? 'Multiple Choice' : 'True/False'}
                    </TypeBadge>
                  </TableCell>
                  <TableCell>{new Date(question.dateCreated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton onClick={() => openViewModal(question)} title="View">
                        <FaEye />
                      </ActionButton>
                      <ActionButton onClick={() => openEditModal(question)} title="Edit">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton onClick={() => openDeleteModal(question)} title="Delete">
                        <FaTrash />
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <EmptyCell colSpan={6}>No questions found</EmptyCell>
              </TableRow>
            )}
          </TableBody>
        </QuestionsTable>
        
        {/* View Question Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="View Question"
        >
          {selectedQuestion && (
            <QuestionDetails>
              <QuestionSection>
                <SectionLabel>Question</SectionLabel>
                <QuestionContent>{selectedQuestion.text}</QuestionContent>
              </QuestionSection>
              
              <QuestionSection>
                <SectionLabel>Category</SectionLabel>
                <QuestionContent>{getCategoryName(selectedQuestion.categoryId)}</QuestionContent>
              </QuestionSection>
              
              <QuestionSection>
                <SectionLabel>Difficulty</SectionLabel>
                <QuestionContent>
                  <DifficultyBadge difficulty={selectedQuestion.difficulty}>
                    {selectedQuestion.difficulty}
                  </DifficultyBadge>
                </QuestionContent>
              </QuestionSection>
              
              <QuestionSection>
                <SectionLabel>Type</SectionLabel>
                <QuestionContent>
                  <TypeBadge type={selectedQuestion.type}>
                    {selectedQuestion.type === 'multiple' ? 'Multiple Choice' : 'True/False'}
                  </TypeBadge>
                </QuestionContent>
              </QuestionSection>
              
              <QuestionSection>
                <SectionLabel>Options</SectionLabel>
                <OptionsList>
                  {selectedQuestion.options.map((option, index) => (
                    <OptionItem key={index} isCorrect={index === selectedQuestion.correctAnswer}>
                      {option} {index === selectedQuestion.correctAnswer && ' (Correct)'}
                    </OptionItem>
                  ))}
                </OptionsList>
              </QuestionSection>
              
              <QuestionSection>
                <SectionLabel>Explanation</SectionLabel>
                <QuestionContent>{selectedQuestion.explanation || 'No explanation provided'}</QuestionContent>
              </QuestionSection>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedQuestion);
                }}>
                  Edit
                </Button>
              </ModalActions>
            </QuestionDetails>
          )}
        </Modal>
        
        {/* Add Question Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Question"
        >
          <FormGroup>
            <FormLabel>Question Text</FormLabel>
            <FormTextarea
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
              placeholder="Enter question text"
              rows={3}
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <FormLabel>Category</FormLabel>
              <FormSelect
                value={newQuestion.categoryId}
                onChange={(e) => setNewQuestion({...newQuestion, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Difficulty</FormLabel>
              <FormSelect
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </FormSelect>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <FormLabel>Question Type</FormLabel>
            <FormSelect
              value={newQuestion.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="multiple">Multiple Choice</option>
              <option value="boolean">True/False</option>
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Options</FormLabel>
            {newQuestion.options.map((option, index) => (
              <OptionRow key={index}>
                <OptionInput
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  disabled={newQuestion.type === 'boolean'}
                />
                <OptionRadio>
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.correctAnswer === index}
                    onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                  />
                  <OptionRadioLabel>Correct</OptionRadioLabel>
                </OptionRadio>
              </OptionRow>
            ))}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Explanation (Optional)</FormLabel>
            <FormTextarea
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
              placeholder="Enter explanation for the correct answer"
              rows={3}
            />
          </FormGroup>
          
          <ModalActions>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddQuestion}>
              Add Question
            </Button>
          </ModalActions>
        </Modal>
        
        {/* Edit Question Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Question"
        >
          {selectedQuestion && (
            <>
              <FormGroup>
                <FormLabel>Question Text</FormLabel>
                <FormTextarea
                  value={selectedQuestion.text}
                  onChange={(e) => setSelectedQuestion({...selectedQuestion, text: e.target.value})}
                  placeholder="Enter question text"
                  rows={3}
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Category</FormLabel>
                  <FormSelect
                    value={selectedQuestion.categoryId}
                    onChange={(e) => setSelectedQuestion({...selectedQuestion, categoryId: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Difficulty</FormLabel>
                  <FormSelect
                    value={selectedQuestion.difficulty}
                    onChange={(e) => setSelectedQuestion({...selectedQuestion, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </FormSelect>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel>Question Type</FormLabel>
                <FormSelect
                  value={selectedQuestion.type}
                  onChange={(e) => handleTypeChange(e.target.value, true)}
                >
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True/False</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Options</FormLabel>
                {selectedQuestion.options.map((option, index) => (
                  <OptionRow key={index}>
                    <OptionInput
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value, true)}
                      placeholder={`Option ${index + 1}`}
                      disabled={selectedQuestion.type === 'boolean'}
                    />
                    <OptionRadio>
                      <input
                        type="radio"
                        name="editCorrectAnswer"
                        checked={selectedQuestion.correctAnswer === index}
                        onChange={() => setSelectedQuestion({...selectedQuestion, correctAnswer: index})}
                      />
                      <OptionRadioLabel>Correct</OptionRadioLabel>
                    </OptionRadio>
                  </OptionRow>
                ))}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Explanation (Optional)</FormLabel>
                <FormTextarea
                  value={selectedQuestion.explanation}
                  onChange={(e) => setSelectedQuestion({...selectedQuestion, explanation: e.target.value})}
                  placeholder="Enter explanation for the correct answer"
                  rows={3}
                />
              </FormGroup>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditQuestion}>
                  Save Changes
                </Button>
              </ModalActions>
            </>
          )}
        </Modal>
        
        {/* Delete Question Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Question"
        >
          {selectedQuestion && (
            <>
              <ConfirmationMessage>
                Are you sure you want to delete this question?
                <QuoteBlock>{selectedQuestion.text}</QuoteBlock>
                This action cannot be undone.
              </ConfirmationMessage>
              
              <ModalActions>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="error" onClick={handleDeleteQuestion}>
                  Delete Question
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

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
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

const FilterGroup = styled.div`
  min-width: 200px;
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  svg {
    color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const QuestionsTable = styled.table`
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

const QuestionText = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DifficultyBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.difficulty) {
      case 'easy':
        return `
          background-color: ${props.theme.success}20;
          color: ${props.theme.success};
        `;
      case 'medium':
        return `
          background-color: ${props.theme.warning}20;
          color: ${props.theme.warning};
        `;
      case 'hard':
        return `
          background-color: ${props.theme.error}20;
          color: ${props.theme.error};
        `;
      default:
        return `
          background-color: ${props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          color: ${props.theme.text};
        `;
    }
  }}
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => props.type === 'multiple' ? `
    background-color: ${props.theme.primary}20;
    color: ${props.theme.primary};
  ` : `
    background-color: ${props.theme.secondary}20;
    color: ${props.theme.secondary};
  `}
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

const QuestionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuestionSection = styled.div``;

const SectionLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
`;

const QuestionContent = styled.div`
  line-height: 1.5;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionItem = styled.div`
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.isCorrect ? 
    props.theme.isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)' : 
    props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
  };
  border: 1px solid ${props => props.isCorrect ? 
    props.theme.isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)' : 
    props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  };
  color: ${props => props.isCorrect ? props.theme.success : props.theme.text};
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

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OptionInput = styled.input`
  flex: 1;
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const OptionRadio = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OptionRadioLabel = styled.span`
  font-size: 0.9rem;
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

const QuoteBlock = styled.blockquote`
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 3px solid ${props => props.theme.primary};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  font-style: italic;
`;

export default AdminQuestions;