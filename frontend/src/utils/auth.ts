export const getToken = () => localStorage.getItem("token");
export const isAuthenticated = () => Boolean(getToken());
export const logout = () => localStorage.removeItem("token");
