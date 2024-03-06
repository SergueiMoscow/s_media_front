
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

export interface Count {
  direct: number;
  total: number;
}

export interface Folder {
  name: string;
  time: string;
  size: number;
  folders_count: Count;
  files_count: Count;
  storage_id: string;
  storage_name: string;
  path: string;
  server_id: string;
  server_name: string;
  server_url: string;
  image_url: string;
  collage_url: string;
}

export interface ParametersFolderView {
  server: string;
  storage: string;
  folder_path: string;
  page: number;
}

export interface FileObject {
  // for file direct (without catalog)
  name: string;
  type: string;
  full_path: string;
  size: number;
  created: string;
  group: string;
  image_url: string;
  selected: boolean; // выделение для групповых операций
  // values from db
  note: string;
  is_public: boolean;
  tags: Array<string>;
  emoji: Array<Object>;
  user_id: string;
  user_name: string;
}


export interface CatalogObject {
  // for file from catalog table
  id: string,
  server_id: string,
  note: string;
  size: number;
  type: string;
  tags: Array<string>;
  emoji: Array<Object>;
  created_at: string;
  // group: string;
  // is_public: boolean;
}
