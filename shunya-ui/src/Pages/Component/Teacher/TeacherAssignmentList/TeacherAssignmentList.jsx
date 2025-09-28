import React, { useEffect, useState } from 'react'
import Loader from '../../Loader/Loader';
import { apiRequests } from '../../../../Api';
import toast from 'react-hot-toast';
import TeacherForm from '../TeacherForm/TeacherForm';

const TeacherAssignmentList = () => {
    const [assignmentList, setAssignmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const token = localStorage.getItem("token");

    const teacherAssignment = async() => {
        try {
            const response = await apiRequests.getRequest('/assignments');
            if(response?.assignments){
                setAssignmentList(response.assignments);
            }
            
        } 
        catch (error) {
           toast.error("Error in fetching data"); 
         
        }
        setLoading(false);
    }

    useEffect(() => {
        teacherAssignment();
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

    const handleCreateAssignment = () => {
        setShowCreateForm(true);
    };

    const handleFormClose = () => {
        setShowCreateForm(false);
        teacherAssignment(); // Refresh the list
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                const response = await apiRequests.deleteRequest(`/assignments/${assignmentId}`);
                if (response?.message) {
                    toast.success('Assignment deleted successfully');
                    teacherAssignment(); // Refresh the list
                }
            } catch (error) {
                toast.error('Failed to delete assignment');
            }
        }
    };

    if(loading){
        return <Loader/>
    }

    return (
        <div className="teacher-assignment-container">
            <div className="teacher-assignment-header">
                <h1>My Assignments</h1>
                <p>Manage your assignments and create new ones</p>
                <button className="create-assignment-btn" onClick={handleCreateAssignment}>
                    Create New Assignment
                </button>
            </div>

            {showCreateForm && (
                <TeacherForm onClose={handleFormClose} />
            )}

            {assignmentList.length === 0 ? (
                <div className="no-assignments">
                    <p>You haven't created any assignments yet.</p>
                    <button className="create-first-btn" onClick={handleCreateAssignment}>
                        Create Your First Assignment
                    </button>
                </div>
            ) : (
                <div className="assignments-grid">
                    {assignmentList.map((assignment) => (
                        <div key={assignment._id} className="assignment-card teacher-card">
                            <div className="assignment-card-header">
                                <h3>{assignment.title}</h3>
                                <span className={`status-badge ${assignment.status}`}>
                                    {assignment.status}
                                </span>
                            </div>
                            
                            <div className="assignment-details">
                                <p><strong>Subject:</strong> {assignment.subject}</p>
                                <p><strong>Deadline:</strong> {formatDate(assignment.deadline)}</p>
                                <p><strong>Created:</strong> {formatDate(assignment.createdAt)}</p>
                            </div>
                            
                            <div className="assignment-description">
                                <p>{assignment.description}</p>
                            </div>
                            
                            <div className="assignment-actions">
                                <button className="edit-btn">Edit</button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteAssignment(assignment._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TeacherAssignmentList