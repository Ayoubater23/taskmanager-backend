import api from '../Auth/api.jsx';

const getUserId = () => Number(localStorage.getItem('user_id'));

export const projectService = {
    getAllProjects: async () => {
        const userId = getUserId();
        const res = await api.get('/projects', { headers: { userId } });
        return res.data;
    },

    createProject: async (project) => {
        const userId = getUserId();
        const res = await api.post('/projects', project, { headers: { userId } });
        return res.data;
    },

    getProjectById: async (projectId) => {
        const userId = getUserId();
        const res = await api.get(`/projects/${projectId}`, { headers: { userId } });
        return res.data;
    },

    deleteProject: async (projectId) => {
        const userId = getUserId();
        await api.delete(`/projects/${projectId}`, { headers: { userId } });
    },
};
