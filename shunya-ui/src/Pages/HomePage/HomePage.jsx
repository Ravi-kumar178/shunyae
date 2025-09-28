import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: ''
  });

  const token = localStorage?.getItem("token");
  const user = localStorage?.getItem("user")? JSON.parse(localStorage?.getItem("user")):null;
  const role = user?.role;

  // Redirect to login if no token
  if (!token) {
    localStorage.clear();
    navigate('/login');
    return null;
  }

  // Show loading or redirect if no user data
  if (!user || !role) {
    navigate('/login');
    return null;
  }

  // Load assignments from localStorage on component mount
  useEffect(() => {
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  // Save assignments to localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const handleLogout = () => {
    // Clear only user data, keep assignments
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  const handleCreateAssignment = () => {
    if (role !== 'teacher') {
      toast.error('Only teachers can create assignments');
      return;
    }
    setShowCreateForm(true);
  };

  const handleViewAssignments = () => {
    setShowAssignments(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.subject || !formData.deadline) {
      toast.error('All fields are required');
      return;
    }

    if (new Date(formData.deadline) <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    const newAssignment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      deadline: formData.deadline,
      teacher: user.name,
      teacherId: user.id,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setAssignments(prev => [newAssignment, ...prev]);
    setFormData({ title: '', description: '', subject: '', deadline: '' });
    setShowCreateForm(false);
    toast.success('Assignment created successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (role !== 'teacher') {
      toast.error('Only teachers can delete assignments');
      return;
    }

    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      toast.success('Assignment deleted successfully');
    }
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedAssignment(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const isOwner = (assignment) => {
    return role === 'teacher' && assignment.teacherId === user.id;
  };

  // Show all assignments to both teachers and students
  const filteredAssignments = assignments;

  return (
    <div className="homepage-container">
      <div className="welcome-section">
        <h1>Welcome, {user.name}!</h1>
        <p>You are logged in as a <strong>{role}</strong></p>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={handleViewAssignments}>
          <div className="card-icon">
            📋
          </div>
          <h3>View Assignments</h3>
          <p>
            {role === 'teacher' 
              ? 'Manage your assignments and create new ones' 
              : 'View all available assignments from teachers'
            }
          </p>
        </div>

        {role === 'teacher' && (
          <div className="dashboard-card" onClick={handleCreateAssignment}>
            <div className="card-icon">
              ➕
            </div>
            <h3>Create Assignment</h3>
            <p>Create new assignments for your students</p>
          </div>
        )}

        <div className="dashboard-card" onClick={handleLogout}>
          <div className="card-icon">
            🚪
          </div>
          <h3>Logout</h3>
          <p>Sign out of your account</p>
        </div>
      </div>

      {/* Assignment Creation Form */}
      {showCreateForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>Create New Assignment</h2>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="assignment-form">
              <div className="form-group">
                <label htmlFor="title">Assignment Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Science, English"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Deadline *</label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the assignment requirements..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment List - Only show when View Assignments is clicked */}
      {showAssignments && (
        <div className="assignments-section">
          <div className="assignments-header">
            <h2>All Assignments</h2>
            <button 
              className="hide-assignments-btn" 
              onClick={() => setShowAssignments(false)}
            >
              Hide Assignments
            </button>
          </div>
          
          {filteredAssignments.length === 0 ? (
            <div className="no-assignments">
              <p>
                No assignments available at the moment.
              </p>
              {role === 'teacher' && (
                <button className="create-first-btn" onClick={handleCreateAssignment}>
                  Create Your First Assignment
                </button>
              )}
            </div>
          ) : (
            <div className="assignments-grid">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className={`assignment-card ${isOwner(assignment) ? 'owner-card' : ''}`}>
                  <div className="assignment-card-header">
                    <h3>{assignment.title}</h3>
                    <div className="card-badges">
                      <span className={`status-badge ${assignment.status}`}>
                        {assignment.status}
                      </span>
                      {isOwner(assignment) && (
                        <span className="owner-badge">Your Assignment</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="assignment-details">
                    <p><strong>Subject:</strong> {assignment.subject}</p>
                    <p><strong>Teacher:</strong> {assignment.teacher}</p>
                    <p><strong>Deadline:</strong> 
                      <span className={isOverdue(assignment.deadline) ? 'overdue' : ''}>
                        {formatDate(assignment.deadline)}
                      </span>
                    </p>
                    <p><strong>Created:</strong> {formatDate(assignment.createdAt)}</p>
                  </div>
                  
                  <div className="assignment-description">
                    <p>{assignment.description}</p>
                  </div>
                  
                  <div className="assignment-actions">
                    <button 
                      className="view-btn" 
                      onClick={() => handleViewDetails(assignment)}
                    >
                      View Details
                    </button>
                    {isOwner(assignment) && (
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assignment Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="details-overlay">
          <div className="details-container">
            <div className="details-header">
              <h2>Assignment Details</h2>
              <button className="close-btn" onClick={handleCloseDetails}>×</button>
            </div>
            
            <div className="details-content">
              <div className="details-section">
                <h3>{selectedAssignment.title}</h3>
                <div className="details-badges">
                  <span className={`status-badge ${selectedAssignment.status}`}>
                    {selectedAssignment.status}
                  </span>
                  {isOwner(selectedAssignment) && (
                    <span className="owner-badge">Your Assignment</span>
                  )}
                </div>
              </div>

              <div className="details-info">
                <div className="info-row">
                  <strong>Subject:</strong>
                  <span>{selectedAssignment.subject}</span>
                </div>
                <div className="info-row">
                  <strong>Teacher:</strong>
                  <span>{selectedAssignment.teacher}</span>
                </div>
                <div className="info-row">
                  <strong>Deadline:</strong>
                  <span className={isOverdue(selectedAssignment.deadline) ? 'overdue' : ''}>
                    {formatDate(selectedAssignment.deadline)}
                  </span>
                </div>
                <div className="info-row">
                  <strong>Created:</strong>
                  <span>{formatDate(selectedAssignment.createdAt)}</span>
                </div>
              </div>

              <div className="details-description">
                <h4>Description</h4>
                <p>{selectedAssignment.description}</p>
              </div>

              <div className="details-actions">
                <button className="close-details-btn" onClick={handleCloseDetails}>
                  Close
                </button>
                {isOwner(selectedAssignment) && (
                  <button 
                    className="delete-details-btn" 
                    onClick={() => {
                      handleDeleteAssignment(selectedAssignment.id);
                      handleCloseDetails();
                    }}
                  >
                    Delete Assignment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage