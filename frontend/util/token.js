export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null
}

export const removeToken = () => {
  return typeof window !== 'undefined' ? localStorage.removeItem('token') : null
}

export const storeUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  return typeof window !== 'undefined' ? localStorage.removeItem('user') : null;
};
