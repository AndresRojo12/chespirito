export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};

export const removeToken = () => {
  return typeof window !== 'undefined'
    ? localStorage.removeItem('token')
    : null;
};
