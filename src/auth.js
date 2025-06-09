
export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Example using localStorage
};
