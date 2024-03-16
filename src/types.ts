
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
  name: string | null | undefined;
  id: string | null | undefined;
  type: string;
  full_path: string;
  size: number;
  created_at: string;
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

export interface CatalogRequest {
  page: number,
  per_page: number,
  date_from: string,
  date_to: string,
  search: string,
  tags: Array<string>,
  public: boolean,
  sort: string,
  sort_direction: string,
}

export function defaultCatalogRequest(): CatalogRequest {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return {
    page: 1,
    per_page: 10,
    date_from: '1900-01-01',
    date_to: formattedDate,
    search: '',
    tags: [],
    public: false,
    sort: '',
    sort_direction: ''
  };
}