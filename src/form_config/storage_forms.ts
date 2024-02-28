export const serverFormConfig = {
  title: 'Добавить сервер',
  id: '',
  fields: {
    name: {
      label: "Название сервера",
      input_type: "text",
      name: "name",
      value: '',
    },
    url: {
      label: "URL сервера",
      input_type: "text",
      name: "url",
      value: '',
    },
  },
  visible: false // управляет отображением формы
};

export const storageFormConfig = {
  title: 'Добавить хранилище',
  id: '',
  fields: {
    server_id: {
      label: 'Выберите сервер',
      input_type: "combo",
      name: 'server_id',
      values_list: [],
      value: '',
    },
    key: {
      label: "Ключ хранилища",
      input_type: "text",
      name: "key",
      value: '',
    },
    name: {
      label: "Название хранилища",
      input_type: "text",
      name: "name",
      value: '',
    },
    path: {
      label: "Путь хранилища",
      input_type: "text",
      name: "path",
      value: '',
    },
  },
  visible: false // управляет отображением формы
};
