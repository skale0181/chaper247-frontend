'use client';

import React, { useState, useEffect } from 'react';

/**
 * TaskModal Component
 * A reusable modal for adding new tasks or editing existing tasks
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {function} onSubmit - Callback when form is submitted
 * @param {object} task - Task object for edit mode (null/undefined for add mode)
 * @param {number} userId - Current user's ID
 */
const TaskModal = ({ isOpen, onClose, onSubmit, task = null, userId }) => {
    const isEditMode = !!task;

    // Form state
    const [formData, setFormData] = useState({
        todo: '',
        completed: false,
        userId: userId || 1,
    });

    const [errors, setErrors] = useState({});

    // Initialize form data when task prop changes (edit mode)
    useEffect(() => {
        if (task) {
            setFormData({
                todo: task.todo || '',
                completed: task.completed || false,
                userId: task.userId || userId,
            });
        } else {
            setFormData({
                todo: '',
                completed: false,
                userId: userId,
            });
        }
        setErrors({});
    }, [task, userId, isOpen]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.todo.trim()) {
            newErrors.todo = 'Task description is required';
        }

        if (!formData.userId || formData.userId < 1) {
            newErrors.userId = 'Valid user ID is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            const submitData = {
                ...formData,
                userId: Number(formData.userId),
            };

            if (isEditMode) {
                submitData.id = task.id;
            }

            onSubmit(submitData);
            onClose();
        }
    };

    // Handle cancel/close
    const handleClose = () => {
        setFormData({
            todo: '',
            completed: false,
            userId: userId || 1,
        });
        setErrors({});
        onClose();
    };

    // Don't render if modal is not open
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={handleClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>
                        {isEditMode ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button
                        onClick={handleClose}
                        style={styles.closeButton}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Todo Input */}
                    <div style={styles.formGroup}>
                        <label htmlFor="todo" style={styles.label}>
                            Task Description *
                        </label>
                        <textarea
                            id="todo"
                            name="todo"
                            value={formData.todo}
                            onChange={handleChange}
                            placeholder="Enter task description..."
                            required
                            rows={3}
                            style={{
                                ...styles.input,
                                ...styles.textarea,
                                ...(errors.todo ? styles.inputError : {})
                            }}
                        />
                        {errors.todo && <span style={styles.errorText}>{errors.todo}</span>}
                    </div>

                    {/* Completed Checkbox */}
                    <div style={styles.formGroup}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="completed"
                                checked={formData.completed}
                                onChange={handleChange}
                                style={styles.checkbox}
                            />
                            <span style={styles.checkboxText}>Mark as completed</span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={handleClose}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={styles.submitButton}
                        >
                            {isEditMode ? 'Update Task' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Styles object
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 30px',
        borderBottom: '1px solid #e9ecef',
    },
    title: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '700',
        color: '#333',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        color: '#999',
        cursor: 'pointer',
        padding: '0',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease, color 0.2s ease',
    },
    form: {
        padding: '30px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#495057',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        border: '2px solid #e1e8ed',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    textarea: {
        resize: 'vertical',
        minHeight: '80px',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        display: 'block',
        color: '#e74c3c',
        fontSize: '13px',
        marginTop: '6px',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        marginRight: '10px',
    },
    checkboxText: {
        fontSize: '15px',
        color: '#495057',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        marginTop: '30px',
    },
    cancelButton: {
        flex: 1,
        padding: '14px 16px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#666',
        backgroundColor: '#f8f9fa',
        border: '2px solid #e1e8ed',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    submitButton: {
        flex: 1,
        padding: '14px 16px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, opacity 0.3s ease',
    },
};

export default TaskModal;
