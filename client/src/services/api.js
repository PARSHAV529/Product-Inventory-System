import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});


export const fetchProducts = async ({ page = 1, limit = 10, search = '', categories = [] }) => {
  const params = { page, limit };

  if (search.trim()) params.search = search.trim();
  if (categories.length) params.categories = categories.join(',');

  const { data } = await api.get('/products', { params });
  return data.data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};


export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};

export default api;
