
export interface Storage {
  server_id: string;
  id: string;
  name: string;
  path: string;
}

export interface Server {
  id: string;
  name: string;
  url: string;
}

export interface Option {
  value: string;
  title: string;
}