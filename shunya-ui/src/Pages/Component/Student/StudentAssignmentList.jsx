import React, { useState, useEffect } from 'react'
import Loader from '../Loader/Loader';
import { apiRequests } from '../../../Api';
import toast from 'react-hot-toast';

const StudentAssignmentList = () => {
  const [assignmentList, setAssignmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage?.getItem("token");

  const studentAssignment = async() => {
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
    studentAssignment();
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

  if(loading){
    return <Loader/>
  }

  return (
    <div className="assignment-container">
      <div className="assignment-header">
        <h1>Available Assignments</h1>
        <p>View all assignments posted by your teachers</p>
      </div>

      {assignmentList.length === 0 ? (
        <div className="no-assignments">
          <p>No assignments available at the moment.</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {assignmentList.map((assignment) => (
            <div key={assignment._id} className="assignment-card">
              <div className="assignment-card-header">
                <h3>{assignment.title}</h3>
                <span className={`status-badge ${assignment.status}`}>
                  {assignment.status}
                </span>
              </div>
              
              <div className="assignment-details">
                <p><strong>Subject:</strong> {assignment.subject}</p>
                <p><strong>Teacher:</strong> {assignment.teacher?.name}</p>
                <p><strong>Deadline:</strong> 
                  <span className={isOverdue(assignment.deadline) ? 'overdue' : ''}>
                    {formatDate(assignment.deadline)}
                  </span>
                </p>
              </div>
              
              <div className="assignment-description">
                <p>{assignment.description}</p>
              </div>
              
              <div className="assignment-actions">
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentAssignmentList