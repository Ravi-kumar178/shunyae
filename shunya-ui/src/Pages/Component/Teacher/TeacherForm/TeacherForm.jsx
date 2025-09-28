import React, { useState } from 'react'
import { apiRequests } from '../../../../Api';
import toast from 'react-hot-toast';
import Loader from '../../Loader/Loader';

const TeacherForm = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        deadline: ""
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {title, description, subject, deadline} = formData;

            if (!title || !description || !subject || !deadline) {
                toast.error("All fields are required.");
                return;
            }

            // Validate deadline is in the future
            if (new Date(deadline) <= new Date()) {
                toast.error("Deadline must be in the future.");
                return;
            }

            const assignmentData = {title, description, subject, deadline};
            const response = await apiRequests.postRequest('/assignments', assignmentData);
            
            if(response?.message){
                toast.success(response.message);
                setFormData({title: "", description: "", subject: "", deadline: ""});
                onClose(); // Close the form
            } else {
                toast.error(response?.message || "Failed to create assignment");
            }

        } catch (error) {
            toast.error('Error in creating assignment');
           
        }
        setLoading(false);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if(loading){
        return <Loader/>
    }
    
    return (
        <div className="teacher-form-overlay">
            <div className="teacher-form-container">
                <div className="form-header">
                    <h2>Create New Assignment</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="assignment-form">
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
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TeacherForm