import axios from 'axios';

// Инициализируем инстанс Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Добавляем интерцептор запросов для инъекции токена авторизации
apiClient.interceptors.request.use(config => {
  const token = window.localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Добавляем интерцептор ответов
apiClient.interceptors.response.use(response => {
  return response;
}, async error => {
  if (error.response.status === 401 && !error.config._retry) {
    error.config._retry = true; // Устанавливаем маркер повторного запроса
    
    try {
      const refreshToken = window.localStorage.getItem('refresh_token');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/token/refresh/`, { refresh: refreshToken });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      error.config.headers['Authorization'] = 'Bearer ' + access;
      
      return apiClient.request(error.config);
    } catch (e) {
      console.error('Не удалось обновить токен:', e);
    }
  }

  // Возвращаем ошибку, если это не 401 или после повторной неудачи
  console.log('apiClient error', error)
  if (error.response && error.response.data) {
    let message = ''
    // debugger
    for (const field in error.response.data) {
      if (error.response.data[field] instanceof Array) {
        message += `${field}: ${error.response.data[field].join(', ')}\n`
        // alert(`${field}: ${error.response.data[field].join(', ')}`);
      } else {
        if (error.response.data.error && error.response.data.error.error_message) {
          message = error.response.data.error.error_message
        } else {
          message += `${field}: ${error.response.data[field]}\n`
        // alert(`${field}: ${error.response.data[field]}`);
        }
      }
    }
    alert(message)
  }
  return Promise.reject(error);
});

export default apiClient;
