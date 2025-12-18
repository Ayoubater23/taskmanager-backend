import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from './ProjectService.jsx';
import { taskService } from './taskService.jsx';
import DeleteModal from './DeleteModal.jsx';
import Toast from './Toast.jsx';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [taskSearch, setTaskSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    const loadProject = async () => {
        const data = await projectService.getProjectById(projectId);
        setProject(data);
    };

    const loadTasks = async () => {
        const data = await taskService.getTasks(projectId);
        setTasks(data);
    };

    useEffect(() => {
        loadProject();
        loadTasks();
    }, [projectId]);

    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 2500);
    };
    const filteredTasks = tasks.filter((t) => {
        const matchesSearch = t.title
            .toLowerCase()
            .includes(taskSearch.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'completed' && t.completed) ||
            (statusFilter === 'pending' && !t.completed);

        return matchesSearch && matchesStatus;
    });


    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim()) {
            showToast('Task title is required!');
            return;
        }

        const duplicate = tasks.some(t => t.title.toLowerCase() === taskTitle.trim().toLowerCase());
        if (duplicate) {
            showToast('Task with this title already exists!');
            return;
        }

        try {
            await taskService.createTask(projectId, {
                title: taskTitle,
                description: taskDescription,
                dueDate: taskDueDate || null,
            });
            setTaskTitle('');
            setTaskDescription('');
            setTaskDueDate('');
            loadTasks();
            showToast('Task created successfully!');
        } catch (err) {
            showToast(err.response?.data || err.message);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await taskService.completeTask(taskId);
            loadTasks();
            showToast('Task marked as completed!');
        } catch (err) {
            showToast(err.response?.data || err.message);
        }
    };

    const handleDeleteTask = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const confirmDeleteTask = async () => {
        try {
            await taskService.deleteTask(selectedTask.id);
            setModalOpen(false);
            setSelectedTask(null);
            loadTasks();
            showToast('Task deleted successfully!');
        } catch (err) {
            showToast(err.response?.data || err.message);
        }
    };

    if (!project) return <div className="p-6">Loading project...</div>;

    return (
        <div className="p-6">
            <button
                onClick={() => navigate('/projects')}
                className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
                ← Back to Projects
            </button>

            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="mb-6">
                <div className="w-full bg-gray-200 h-4 rounded">
                    <div
                        className="bg-indigo-600 h-4 rounded"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-700 mt-1">{progress}% completed</p>
            </div>

            <form onSubmit={handleCreateTask} className="mb-6 flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <input
                    type="text"
                    placeholder="Task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Add Task
                </button>
            </form>
            <div className="flex gap-3 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>


            <ul>
                {filteredTasks.map((t) => (
                    <li
                        key={t.id}
                        className="mb-2 p-3 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/projects/${projectId}`)}
                    >
                        <div>
                            <h2 className={`font-semibold ${t.completed ? 'line-through text-gray-500' : ''}`}>
                                {t.title}
                            </h2>
                            <p className="text-gray-600">{t.description}</p>
                            {t.dueDate && <p className="text-sm text-gray-400">Due: {new Date(t.dueDate).toLocaleDateString()}</p>}
                        </div>
                        <div className="flex gap-2">
                            {!t.completed && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCompleteTask(t.id); }}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Complete
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteTask(t); }}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>


            <DeleteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDeleteTask}
                itemName={selectedTask?.title}
            />


            <Toast message={toast.message} show={toast.show} />
        </div>
    );
};

export default ProjectDetailPage;
