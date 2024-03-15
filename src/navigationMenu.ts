import apiClient from "./apiClient";

interface StorageItem { // Тип элемента хранилища, если он не определён в другом месте
  name: string;
  id: string;
}

interface NavigationItem {
  title: string;
  value: string;
  icon: string;
  path: string;
  requiresAuth: boolean;
  items?: StorageItem[]; // Для подменю
}

// Возможные пункты меню
const navigation_items: NavigationItem[] = [
    {
      title: "Домашняя",
      value: "home",
      icon: "mdi-home-outline",
      path: "/",
      requiresAuth: false,
    },
    {
      title: "Каталоги",
      value: "catalogs",
      icon: "mdi-folder-multiple-image",
      path: "/catalog_content",
      requiresAuth: true,
    },
    {
      title: "Хранилища",
      value: "content",
      icon: "mdi-database",
      path: "/folder_content",
      requiresAuth: true,
    },
    {
      title: "Серверы",
      value: "storages",
      icon: "mdi-server",
      path: "/storages",
      requiresAuth: true,
    },
    {
      title: "О системе",
      value: "about",
      icon: "mdi-information-variant",
      path: "/about",
      requiresAuth: false,
    },
  ];

async function fetchStorages(): Promise<StorageItem[]> {
  const response = await apiClient.get(`/storages/`);
  return response.data.results;
}

// Функция для инициализации навигационных пунктов
export async function initializeNavigationItems(isUserLoggedIn: boolean): Promise<NavigationItem[]> {
  if (isUserLoggedIn) {
    const storagesList = await fetchStorages();
    const catalogsIndex = navigation_items.findIndex((item) => item.value === "catalogs");
    if (catalogsIndex !== -1) {
      // Проверяем, есть ли уже элементы в массиве, чтобы избежать повторного добавления
      navigation_items[catalogsIndex].items = storagesList;
    }
  }

  // Фильтруем пункты меню по полю requiresAuth
  return navigation_items.filter(
    (item) => !item.requiresAuth || isUserLoggedIn
  );
}
