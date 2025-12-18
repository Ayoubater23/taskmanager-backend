import React, { useEffect, useState } from 'react';
import { projectService } from './ProjectService.jsx';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal.jsx';
import Toast from './Toast.jsx';
import { useAuth } from '../Auth/AuthContext.jsx';

const ProjectsPage = () => {
    const [search, setSearch] = useState('');
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    const navigate = useNavigate();
    const { logout } = useAuth();

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );


    const loadProjects = async () => {
        const data = await projectService.getAllProjects();
        setProjects(data);
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!title) return setToast({ show: true, message: 'Title is required!' });

        const duplicate = projects.some(p => p.title.toLowerCase() === title.trim().toLowerCase());
        if (duplicate) {
            setToast({ show: true, message: 'Project with this title already exists!' });
            setTimeout(() => setToast({ show: false, message: '' }), 2500);
            return;
        }

        try {
            await projectService.createProject({ title, description });
            setTitle('');
            setDescription('');
            loadProjects();
            setToast({ show: true, message: 'Project created successfully!' });
        } catch (err) {
            setToast({ show: true, message: err.response?.data || err.message });
        }

        setTimeout(() => setToast({ show: false, message: '' }), 2500);
    };


    const handleDeleteClick = (project) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        await projectService.deleteProject(selectedProject.id);
        setModalOpen(false);
        setSelectedProject(null);
        setToast({ show: true, message: 'Project deleted successfully!' });
        loadProjects();
        setTimeout(() => setToast({ show: false, message: '' }), 2500);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Projects</h1>
                <button
                    onClick={handleLogout}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={handleCreateProject} className="mb-6 flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <input
                    type="text"
                    placeholder="Project description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Create
                </button>
            </form>

            <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full mb-4"
            />


            <ul>
                {filteredProjects.map((p) => (
                    <li
                        key={p.id}
                        className="mb-2 p-3 border rounded hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => navigate(`/projects/${p.id}`)}
                    >
                        <span className="text-indigo-600 font-semibold">{p.title}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(p);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <DeleteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedProject?.title}
            />

            <Toast message={toast.message} show={toast.show} />
        </div>
    );
};

export default ProjectsPage;
