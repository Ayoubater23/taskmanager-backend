import React, { useState, useEffect } from 'react';

const EditTaskModal = ({ task, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        }
    }, [task]);

    if (!task) return null;

    const handleSave = () => {
        if (!title) return alert('Task title is required!');
        onSave({ title, description, dueDate: dueDate || null });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border px-3 py-2 w-full mb-3 rounded"
                />

                <input
                    type="text"
                    placeholder="Task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border px-3 py-2 w-full mb-3 rounded"
                />

                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border px-3 py-2 w-full mb-4 rounded"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
