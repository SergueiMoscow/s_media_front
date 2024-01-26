export const serverFormConfig = {
    title: 'Добавить сервер',
    fields: [
      {
        label: "Название сервера",
        input_type: "text",
        name: "name",
      },
      {
        label: "URL сервера",
        input_type: "text",
        name: "url",
      },
    ],
    visible: false // управляет отображением формы
  };
  
  export const storageFormConfig = {
    title: 'Добавить хранилище',
    fields: [
      {
        label: "Название хранилища",
        input_type: "text",
        name: "name",
      },
      {
        label: 'Выберите сервер',
        input_type: "combo",
        name: 'server_id',
        values_list: [{ value: 1, text: 'Test server 1' }, { value: 2, text: 'Test server 2' }],
        default_value: 1,
      }
    ],
    visible: false // управляет отображением формы
  };
  