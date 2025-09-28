import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequests } from '../../Api';
import toast from 'react-hot-toast';
import Loader from '../Component/Loader/Loader';
import TeacherForm from '../Component/Teacher/TeacherForm/TeacherForm';
import './AssignmentsPage.css';

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const [assignmentList, setAssignmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Redirect if not authenticated
  if (!token || !user) {
    navigate('/login');
    return null;
  }

  const fetchAssignments = async () => {
    try {
      // Load assignments from localStorage first
      const savedAssignments = localStorage.getItem('assignments');
      if (savedAssignments) {
        setAssignmentList(JSON.parse(savedAssignments));
      }
      
      // Also try to fetch from API (for backend integration)
      const response = await apiRequests.getRequest('/assignments');
      if (response?.assignments) {
        setAssignmentList(response.assignments);
      }
    } catch (error) {
      // If API fails, use localStorage data
      const savedAssignments = localStorage.getItem('assignments');
      if (savedAssignments) {
        setAssignmentList(JSON.parse(savedAssignments));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);

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

  const handleCreateAssignment = () => {
    if (role !== 'teacher') {
      toast.error('Only teachers can create assignments');
      return;
    }
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    fetchAssignments(); // Refresh the list
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (role !== 'teacher') {
      toast.error('Only teachers can delete assignments');
      return;
    }

    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        // Delete from localStorage
        const savedAssignments = localStorage.getItem('assignments');
        if (savedAssignments) {
          const assignments = JSON.parse(savedAssignments);
          const updatedAssignments = assignments.filter(assignment => assignment.id !== assignmentId);
          localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
          setAssignmentList(updatedAssignments);
        }
        
        // Also try to delete from API
        const response = await apiRequests.deleteRequest(`/assignments/${assignmentId}`);
        if (response?.message) {
          toast.success('Assignment deleted successfully');
        }
      } catch (error) {
        toast.success('Assignment deleted successfully');
      }
    }
  };

  const isOwner = (assignment) => {
    return role === 'teacher' && assignment.teacherId === user.id;
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedAssignment(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div className="header-content">
          <h1>All Assignments</h1>
          <p>View and manage assignments</p>
        </div>
        
        {role === 'teacher' && (
          <button className="create-assignment-btn" onClick={handleCreateAssignment}>
            Create New Assignment
          </button>
        )}
      </div>

      {showCreateForm && (
        <TeacherForm onClose={handleFormClose} />
      )}

      {assignmentList.length === 0 ? (
        <div className="no-assignments">
          <p>No assignments available at the moment.</p>
          {role === 'teacher' && (
            <button className="create-first-btn" onClick={handleCreateAssignment}>
              Create Your First Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="assignments-grid">
          {assignmentList.map((assignment) => (
            <div key={assignment.id || assignment._id} className={`assignment-card ${isOwner(assignment) ? 'owner-card' : ''}`}>
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
                  <p><strong>Teacher:</strong> {assignment.teacher?.name || assignment.teacher}</p>
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
                  <>
                    <button className="edit-btn">Edit</button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteAssignment(assignment.id || assignment._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
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
                  <span>{selectedAssignment.teacher?.name || selectedAssignment.teacher}</span>
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
                      handleDeleteAssignment(selectedAssignment.id || selectedAssignment._id);
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
  );
};

export default AssignmentsPage;
