import { defaultMenuData, type MenuData } from './menuStorage';

export async function fetchMenuFromServer(): Promise<MenuData | null> {
 try {
  const res = await fetch('/api/menu', { method: 'GET' });
  if (!res.ok) return null;
  const data = (await res.json()) as { menu: unknown };
  if (!data?.menu || typeof data.menu !== 'object') return null;
  return { ...defaultMenuData, ...(data.menu as Partial<MenuData>) };
 } catch {
  return null;
 }
}

export async function saveMenuToServer(menu: MenuData, pin: string): Promise<boolean> {
 try {
  const res = await fetch('/api/menu', {
   method: 'POST',
   headers: {
    'content-type': 'application/json',
    'x-admin-pin': pin,
   },
   body: JSON.stringify({ menu }),
  });
  return res.ok;
 } catch {
  return false;
 }
}
