export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    TODOS: {
        GET_BY_USER: (userId) => `/todos/user/${userId}`,
        CREATE: '/todos/add-todo',
        DELETE: (id) => `/todos/delete-todo/${id}`,
        UPDATE_STATUS: (id) => `/todos/update-status/${id}`,
        UPDATE_TODO: (id) => `/todos/update-todo/${id}`,
    }
};
