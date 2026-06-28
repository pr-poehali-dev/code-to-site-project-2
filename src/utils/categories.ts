export type Category = {
  key: string;
  name: string;
  budget: number;
  emoji: string;
};

const CATS_KEY = 'budget_categories';

export const DEFAULT_CATEGORIES: Category[] = [
  { key: 'rent',   name: 'Аренда',                budget: 30000, emoji: '🏠' },
  { key: 'credit', name: 'Кредиты',               budget: 30000, emoji: '💳' },
  { key: 'food',   name: 'Продукты',              budget: 25000, emoji: '🛒' },
  { key: 'fun',    name: 'Радости и развлечения', budget: 20000, emoji: '🎉' },
  { key: 'trans',  name: 'Транспорт',             budget: 8000,  emoji: '🚗' },
  { key: 'pets',   name: 'Животные',              budget: 5000,  emoji: '🐱' },
  { key: 'beauty', name: 'Красота/здоровье',      budget: 5000,  emoji: '💆' },
  { key: 'comm',   name: 'Связь',                 budget: 3500,  emoji: '📱' },
  { key: 'chem',   name: 'Бытовая химия',         budget: 1500,  emoji: '🧴' },
  { key: 'sergey', name: 'Личные Серёжи',         budget: 15000, emoji: '🎧' },
  { key: 'vika',   name: 'Личные Вики',           budget: 15000, emoji: '🧑‍💻' },
];

export function loadCategories(): Category[] {
  try {
    const v = localStorage.getItem(CATS_KEY);
    return v ? JSON.parse(v) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(cats: Category[]) {
  try { localStorage.setItem(CATS_KEY, JSON.stringify(cats)); } catch (_) { /* ignore */ }
}

export function totalBudget(cats: Category[]) {
  return cats.reduce((a, c) => a + c.budget, 0);
}
