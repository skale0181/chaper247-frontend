// tasks page
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { request } from '@/lib/api';
import GlobalHeader from '@/components/GlobalHeader';
import TaskModal from './components/TaskModal';
import { usePopup } from '@/components/PopupMessage';
import { API_ROUTES } from '@/configue/routes';

const TasksPage = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Fetch todos by user id
    const fetchTodos = async () => {
        try {
            const res = await request.get(API_ROUTES.TODOS.GET_BY_USER(user?.id));
            setTodos(res.data.todos || res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user]);

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            let res = await request.delete(API_ROUTES.TODOS.DELETE(id));
            //set direct in the list because not updated in the server
            if (res.status === 200) {
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (error) {
            //explisitly delete the item from the list if not deleted in the server
            if (error?.response?.data?.message === "Request failed with status code 404")
                setTodos(todos.filter(t => t.id !== id));
            console.error(error?.response?.data?.message || error?.message);
        }
    };

    // Toggle todo status 
    const toggle = async (task) => {
        try {
            let res = await request.put(API_ROUTES.TODOS.UPDATE_STATUS(task.id), { completed: !task.completed });
            //set direct in the list because not updated in the server
            console.log(res);
            if (res.status === 200) {
                setTodos(todos.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
            }
        } catch (error) {
            // explisitly update the item in the list if not updated in the server
            if (error?.response?.data?.message === "Request failed with status code 404")
                setTodos(todos.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
            console.error(error?.response?.data?.message || error?.message);
        }
    };

    // Modal handlers
    const openAddModal = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    // Open edit modal
    const openEditModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // Handle task submit
    const handleTaskSubmit = async (taskData) => {
        // Adding a new todo will not add it into the server.
        // It will simulate a POST request and will return the new created todo with a new id
        try {
            if (selectedTask) {
                // Edit mode
                let res = await request.put(API_ROUTES.TODOS.UPDATE_TODO(selectedTask.id), taskData);
                //set direct in the list
                if (res.status === 200) {
                    setTodos(todos.map(t => t.id === selectedTask.id ? res.data : t));
                }
            } else {
                // Add 
                try {
                    let res = await request.post(API_ROUTES.TODOS.CREATE, taskData);
                    //set direct in the list
                    if (res.status === 200) {
                        setTodos([...todos, res.data]);
                    }
                } catch (error) {
                    // explisitly add the item in the list if not added in the server
                    if (error?.response?.data?.message === "Request failed with status code 404")
                        setTodos([...todos, taskData]);
                    console.error(error?.response?.data?.message || error?.message);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <GlobalHeader />
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ margin: 0 }}>Tasks</h1>
                    <button onClick={openAddModal} style={styles.addButton}>
                        + Add Task
                    </button>
                </div>

                <ul style={styles.taskList}>
                    {todos.map(t => (
                        <li key={`${t.id}-${t.todo}`} style={styles.taskItem}>
                            <div style={styles.taskContent}>
                                <input
                                    type="checkbox"
                                    checked={t.completed}
                                    onChange={() => toggle(t)}
                                    style={styles.checkbox}
                                />
                                <span style={{
                                    ...styles.taskText,
                                    ...(t.completed ? styles.completedTask : {})
                                }}>
                                    {t.todo}
                                </span>
                            </div>
                            <div style={styles.taskActions}>
                                <button
                                    onClick={() => openEditModal(t)}
                                    style={styles.editButton}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTodo(t.id)}
                                    style={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleTaskSubmit}
                task={selectedTask}
                userId={user?.id}
            />
        </>
    );
}

// Styles for tasks page
const styles = {
    addButton: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, opacity 0.3s ease',
    },
    taskList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    taskItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #e1e8ed',
        borderRadius: '8px',
        transition: 'box-shadow 0.2s ease',
    },
    taskContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
    },
    taskText: {
        fontSize: '15px',
        color: '#333',
    },
    completedTask: {
        textDecoration: 'line-through',
        color: '#999',
    },
    taskActions: {
        display: 'flex',
        gap: '8px',
    },
    editButton: {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#667eea',
        backgroundColor: '#f0f1ff',
        border: '1px solid #667eea',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    deleteButton: {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#e74c3c',
        backgroundColor: '#ffe6e6',
        border: '1px solid #e74c3c',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
};

export default TasksPage;
