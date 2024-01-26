import axios from 'axios';

// Инициализируем инстанс Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Замените на реальный URL вашего API
});

// Добавляем интерцептор запросов для инъекции токена авторизации
apiClient.interceptors.request.use(config => {
  // Получаем токен из хранилища
  const token = window.localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  // Обработка ошибок при запросе
  return Promise.reject(error);
});

// Добавляем интерцептор ответов
apiClient.interceptors.response.use(response => {
  // Если ответ успешный, просто возвращаем его
  return response;
}, async error => {
  // Проверяем, не связана ли ошибка с истечением срока действия токена
  if (error.response.status === 401 && !error.config._retry) {
    error.config._retry = true; // Устанавливаем маркер повторного запроса
    
    try {
      // Здесь добавьте вашу логику для получения нового токена
      const refreshToken = window.localStorage.getItem('refresh_token');
      // Обращаемся за новым токеном с использванием токена обновления
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/token/refresh/`, { refresh: refreshToken });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Обновляем токен в текущем неудачном запросе
      error.config.headers['Authorization'] = 'Bearer ' + access;
      
      // Повторно выполняем запрос с обновленным токеном
      return apiClient.request(error.config);
    } catch (e) {
      // Ошибка при обновлении токена - возможно, пользователь должен будет заново аутентифицироваться
      console.error('Не удалось обновить токен:', e);
      // Здесь может быть редирект на страницу входа или обработка выхода пользователя
    }
  }

  // Возвращаем ошибку, если это не 401 или после повторной неудачи
  return Promise.reject(error);
});

export default apiClient;
