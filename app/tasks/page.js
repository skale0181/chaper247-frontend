// tasks page
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { request } from '@/lib/api';
import GlobalHeader from '@/components/GlobalHeader';

const TasksPage = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    console.log(user);
    const fetchTodos = async () => {
        try {
            const res = await request.get(`/todos/user/${user?.id}`);
            setTodos(res.data.todos || res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { if (user) fetchTodos(); }, [user]);

    const addTodo = async (e) => {
        e.preventDefault();
        try {
            const resp = await request.post('/todos', { todo: title, completed: false, userId: user?.id || 1 });
            // the dummyjson response structure may vary
            // refresh list
            fetchTodos();
            setTitle('');
        } catch (err) { console.error(err); }
    };

    const deleteTodo = async (id) => {
        await request.delete(`/todos/${id}`);
        fetchTodos();
    };

    const toggle = async (t) => {
        await request.put(`/todos/${t.id}`, { completed: !t.completed });
        fetchTodos();
    };

    return (
        <>
            <GlobalHeader />
            <div style={{ padding: '2rem' }}>
                <h1>Tasks</h1>
                <form onSubmit={addTodo}>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" required />
                    <button type="submit">Add</button>
                </form>
                <ul>
                    {todos.map(t => (
                        <li key={t.id}>
                            <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                            {t.todo}
                            <button onClick={() => deleteTodo(t.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default TasksPage;
