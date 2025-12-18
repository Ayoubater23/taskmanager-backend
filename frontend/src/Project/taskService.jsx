import api from '../Auth/api.jsx';

const getUserId = () => Number(localStorage.getItem('user_id'));

export const taskService = {
    getTasks: async (projectId) => {
        const userId = getUserId();
        const res = await api.get(`/tasks/project/${projectId}`, { headers: { userId } });
        return res.data;
    },

    createTask: async (projectId, task) => {
        const userId = getUserId();

        const taskPayload = {
            ...task,
            dueDate: task.dueDate ? `${task.dueDate}T00:00:00` : null,
        };

        const res = await api.post(`/tasks/project/${projectId}`, taskPayload, { headers: { userId } });
        return res.data;
    },

    updateTask: async (taskId, task) => {
        const userId = getUserId();
        const taskPayload = {
            ...task,
            dueDate: task.dueDate ? `${task.dueDate}T00:00:00` : null,
        };
        const res = await api.patch(`/tasks/${taskId}`, taskPayload, { headers: { userId } });
        return res.data;
    },

    completeTask: async (taskId) => {
        const userId = getUserId();
        const res = await api.patch(`/tasks/${taskId}/complete`, null, { headers: { userId } });
        return res.data;
    },

    deleteTask: async (taskId) => {
        const userId = getUserId();
        await api.delete(`/tasks/${taskId}`, { headers: { userId } });
    },

    searchTasks: async (projectId, query) => {
        const userId = getUserId();
        const res = await api.get(`/tasks/project/${projectId}/search`, {
            headers: { userId },
            params: query,
        });
        return res.data;
    },
};
