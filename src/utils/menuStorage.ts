import {
 broast,
 fatayerShami,
 fatayerSweet,
 juices,
 pizzas,
 sandwiches,
 type MenuLine,
 type MenuLine2Prices,
 type MenuLine3Prices,
} from '../data/menu';

const MENU_KEY = 'pizzeti_menu_v1';

export type MenuData = {
 fatayerShami: MenuLine[];
 fatayerSweet: MenuLine[];
 broast: MenuLine[];
 sandwiches: MenuLine2Prices[];
 pizzas: MenuLine3Prices[];
 juices: MenuLine[];
};

export const defaultMenuData: MenuData = {
 fatayerShami,
 fatayerSweet,
 broast,
 sandwiches,
 pizzas,
 juices,
};

export function loadMenuData(): MenuData {
 const raw = localStorage.getItem(MENU_KEY);
 if (!raw) return defaultMenuData;

 try {
  const parsed = JSON.parse(raw) as Partial<MenuData>;
  return {
   fatayerShami: parsed.fatayerShami ?? defaultMenuData.fatayerShami,
   fatayerSweet: parsed.fatayerSweet ?? defaultMenuData.fatayerSweet,
   broast: parsed.broast ?? defaultMenuData.broast,
   sandwiches: parsed.sandwiches ?? defaultMenuData.sandwiches,
   pizzas: parsed.pizzas ?? defaultMenuData.pizzas,
   juices: parsed.juices ?? defaultMenuData.juices,
  };
 } catch {
  return defaultMenuData;
 }
}

export function saveMenuData(data: MenuData): void {
 localStorage.setItem(MENU_KEY, JSON.stringify(data));
}

export function resetMenuData(): void {
 localStorage.removeItem(MENU_KEY);
}
