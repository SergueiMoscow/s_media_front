export const serverFormConfig = {
  title: 'Добавить сервер',
  id: 0,
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
  id: 0,
  fields: {
    server_id: {
      label: 'Выберите сервер',
      input_type: "combo",
      name: 'server_id',
      values_list: [{ value: '1', title: 'Test server 1' }, { value: '2', title: 'Test server 2' }],
      value: '1',
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
