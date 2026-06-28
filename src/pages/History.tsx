import { useState } from 'react';
import { loadData, ru, CATEGORIES } from './CurrentMonth';

const CARD_BG = 'rgba(255,255,255,0.9)';
const BORDER = '#f5e6dc';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';
const ACCENT = '#e07a5f';
const ACCENT_LIGHT = '#fef0e7';

type Expense = { id: string; category: string; amount: number; comment: string; date: string };
type Income  = { id: string; who: string; amount: number; comment: string; date: string };

type MonthData = {
  year: number;
  month: number; // 0-11
  label: string;
  expenses: Expense[];
  incomes: Income[];
};

// Собираем все месяцы из localStorage
function getAllMonths(): MonthData[] {
  const months: MonthData[] = [];
  const now = new Date();

  // Смотрим 12 месяцев назад + текущий
  for (let offset = -11; offset <= 0; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `budget_${year}_${month}`;
    const expenses: Expense[] = loadData(key + '_exp', []);
    const incomes: Income[]   = loadData(key + '_inc', []);
    if (expenses.length > 0 || incomes.length > 0) {
      months.push({
        year, month,
        label: d.toLocaleString('ru-RU', { month: 'long', year: 'numeric' }),
        expenses,
        incomes,
      });
    }
  }
  return months.reverse(); // сначала новые
}

const cat = (key: string) => CATEGORIES.find(c => c.key === key);

export default function History() {
  const months = getAllMonths();
  const [openMonth, setOpenMonth] = useState<string | null>(
    months.length > 0 ? `${months[0].year}_${months[0].month}` : null
  );
  const [tab, setTab] = useState<'all' | 'exp' | 'inc'>('all');

  if (months.length === 0) {
    return (
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 40, border: `1px solid ${BORDER}`, textAlign: 'center', color: TEXT2 }}>
        📭 История пока пуста — внесите расходы или доходы в текущем месяце.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2 }}>📜 История по месяцам</div>

      {months.map(m => {
        const mk = `${m.year}_${m.month}`;
        const isOpen = openMonth === mk;
        const totalExp = m.expenses.reduce((a, e) => a + e.amount, 0);
        const totalInc = m.incomes.reduce((a, i) => a + i.amount, 0);

        // группируем расходы по категориям
        const byCategory: Record<string, number> = {};
        for (const e of m.expenses) byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;

        const filtered = tab === 'exp'
          ? { expenses: m.expenses, incomes: [] }
          : tab === 'inc'
            ? { expenses: [], incomes: m.incomes }
            : { expenses: m.expenses, incomes: m.incomes };

        return (
          <div key={mk} style={{ background: CARD_BG, borderRadius: 24, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            {/* Шапка месяца */}
            <div
              onClick={() => setOpenMonth(isOpen ? null : mk)}
              style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, userSelect: 'none' }}
            >
              <div style={{ display: 'flex', align: 'center', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: TEXT, textTransform: 'capitalize' }}>{m.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {totalInc > 0 && (
                  <span style={{ background: GREEN_LIGHT, color: GREEN, fontWeight: 700, padding: '4px 12px', borderRadius: 20, fontSize: '0.9rem' }}>
                    +{ru(totalInc)} ₽
                  </span>
                )}
                {totalExp > 0 && (
                  <span style={{ background: ACCENT_LIGHT, color: ACCENT, fontWeight: 700, padding: '4px 12px', borderRadius: 20, fontSize: '0.9rem' }}>
                    −{ru(totalExp)} ₽
                  </span>
                )}
                <span style={{ color: TEXT2, fontSize: '1rem' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Детали */}
            {isOpen && (
              <div style={{ padding: '0 24px 24px' }}>

                {/* Сводка по категориям */}
                {m.expenses.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: TEXT2, marginBottom: 10 }}>Расходы по категориям</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {Object.entries(byCategory).map(([key, amt]) => {
                        const c = cat(key);
                        return (
                          <div key={key} style={{ background: '#fef9f5', borderRadius: 14, padding: '8px 14px', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{c?.emoji}</span>
                            <span style={{ fontSize: '0.85rem', color: TEXT2 }}>{c?.name}</span>
                            <span style={{ fontWeight: 700, color: ACCENT, marginLeft: 4 }}>{ru(amt)} ₽</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Фильтр */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {(['all', 'exp', 'inc'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                      padding: '6px 14px', borderRadius: 20, border: '1px solid #e7d7cc',
                      background: tab === t ? '#e07a5f' : '#fffaf6',
                      color: tab === t ? 'white' : TEXT2,
                      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                      fontFamily: "'Nunito', sans-serif",
                    }}>
                      {t === 'all' ? 'Все' : t === 'exp' ? '📤 Расходы' : '📥 Доходы'}
                    </button>
                  ))}
                </div>

                {/* Лента */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    ...filtered.incomes.map(i => ({ type: 'inc' as const, item: i })),
                    ...filtered.expenses.map(e => ({ type: 'exp' as const, item: e })),
                  ]
                    .sort((a, b) => {
                      const da = a.item.date.split('.').reverse().join('');
                      const db = b.item.date.split('.').reverse().join('');
                      return db.localeCompare(da);
                    })
                    .map(({ type, item }) => {
                      if (type === 'inc') {
                        const i = item as Income;
                        return (
                          <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: GREEN_LIGHT, borderRadius: 12, padding: '8px 14px' }}>
                            <span>{i.who === 'Вика' ? '🧑‍💻' : '🎧'}</span>
                            <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{i.who}{i.comment ? ` — ${i.comment}` : ''}</span>
                            <span style={{ fontWeight: 700, color: GREEN, whiteSpace: 'nowrap' }}>+{ru(i.amount)} ₽</span>
                            <span style={{ fontSize: '0.78rem', color: TEXT2 }}>{i.date}</span>
                          </div>
                        );
                      } else {
                        const e = item as Expense;
                        const c = cat(e.category);
                        return (
                          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef9f5', borderRadius: 12, padding: '8px 14px' }}>
                            <span>{c?.emoji}</span>
                            <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{c?.name}{e.comment ? ` — ${e.comment}` : ''}</span>
                            <span style={{ fontWeight: 700, color: ACCENT, whiteSpace: 'nowrap' }}>−{ru(e.amount)} ₽</span>
                            <span style={{ fontSize: '0.78rem', color: TEXT2 }}>{e.date}</span>
                          </div>
                        );
                      }
                    })}
                </div>

                {filtered.expenses.length === 0 && filtered.incomes.length === 0 && (
                  <div style={{ color: TEXT2, fontSize: '0.9rem' }}>Нет записей</div>
                )}

                {/* Итог месяца */}
                <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap', paddingTop: 14, borderTop: `1px dashed ${BORDER}` }}>
                  {totalInc > 0 && <div style={{ fontSize: '0.9rem', color: GREEN }}><strong>Доходы:</strong> {ru(totalInc)} ₽</div>}
                  {totalExp > 0 && <div style={{ fontSize: '0.9rem', color: ACCENT }}><strong>Расходы:</strong> {ru(totalExp)} ₽</div>}
                  {totalInc > 0 && totalExp > 0 && (
                    <div style={{ fontSize: '0.9rem', color: totalInc - totalExp >= 0 ? GREEN : '#c0392b', fontWeight: 700 }}>
                      Баланс: {totalInc - totalExp >= 0 ? '+' : ''}{ru(totalInc - totalExp)} ₽
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
