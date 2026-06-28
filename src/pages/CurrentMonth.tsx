import { useState, useEffect } from 'react';

const ACCENT = '#e07a5f';
const ACCENT_LIGHT = '#fef0e7';
const CARD_BG = 'rgba(255,255,255,0.9)';
const BORDER = '#f5e6dc';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';

export const CATEGORIES = [
  { key: 'rent',    name: 'Аренда',                budget: 30000, emoji: '🏠' },
  { key: 'credit',  name: 'Кредиты',               budget: 30000, emoji: '💳' },
  { key: 'food',    name: 'Продукты',              budget: 25000, emoji: '🛒' },
  { key: 'fun',     name: 'Радости и развлечения', budget: 20000, emoji: '🎉' },
  { key: 'trans',   name: 'Транспорт',             budget: 8000,  emoji: '🚗' },
  { key: 'pets',    name: 'Животные',              budget: 5000,  emoji: '🐱' },
  { key: 'beauty',  name: 'Красота/здоровье',      budget: 5000,  emoji: '💆' },
  { key: 'comm',    name: 'Связь',                 budget: 3500,  emoji: '📱' },
  { key: 'chem',    name: 'Бытовая химия',         budget: 1500,  emoji: '🧴' },
  { key: 'sergey',  name: 'Личные Серёжи',         budget: 15000, emoji: '🎧' },
  { key: 'vika',    name: 'Личные Вики',           budget: 15000, emoji: '🧑‍💻' },
  { key: 'savings', name: 'Накопления',            budget: 0,     emoji: '🏦' },
  { key: 'reserve', name: 'Основной резерв',       budget: 0,     emoji: '💰' },
];

export const TOTAL_FIXED = CATEGORIES.filter(c => c.budget > 0).reduce((a, c) => a + c.budget, 0);

export type Income = { id: string; who: string; amount: number; comment: string; date: string };
type Expense = { id: string; category: string; amount: number; comment: string; date: string };

const today = () => new Date().toLocaleDateString('ru-RU');
export const ru = (n: number) => Math.round(n).toLocaleString('ru-RU');

// ключ для месяца: 0 = текущий, -1 = предыдущий
export const monthKey = (offset = 0) => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `budget_${d.getFullYear()}_${d.getMonth()}`;
};

export function loadData<T>(key: string, def: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
export function saveData(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) { /* ignore */ }
}

export default function CurrentMonth() {
  const mk = monthKey(0);   // текущий месяц
  const pmk = monthKey(-1); // предыдущий месяц

  const [expenses, setExpenses] = useState<Expense[]>(() => loadData(mk + '_exp', []));
  const [incomes, setIncomes]   = useState<Income[]>(() => loadData(mk + '_inc', []));

  // Бюджет текущего месяца = доходы прошлого месяца
  const prevIncomes: Income[] = loadData(pmk + '_inc', []);
  const totalBudget = prevIncomes.reduce((a, i) => a + i.amount, 0);

  const [expCat,  setExpCat]  = useState(CATEGORIES[0].key);
  const [expAmt,  setExpAmt]  = useState('');
  const [expNote, setExpNote] = useState('');
  const [incWho,  setIncWho]  = useState('Вика');
  const [incAmt,  setIncAmt]  = useState('');
  const [incNote, setIncNote] = useState('');

  useEffect(() => { saveData(mk + '_exp', expenses); }, [expenses, mk]);
  useEffect(() => { saveData(mk + '_inc', incomes); }, [incomes, mk]);

  const spent: Record<string, number> = {};
  for (const e of expenses) spent[e.category] = (spent[e.category] || 0) + e.amount;

  const totalSpent = expenses.reduce((a, e) => a + e.amount, 0);
  const totalLeft  = totalBudget - totalSpent;
  const totalNextIncome = incomes.reduce((a, i) => a + i.amount, 0);

  const addExpense = () => {
    const amt = parseFloat(expAmt.replace(/\s/g, '').replace(',', '.'));
    if (!amt || amt <= 0) return;
    setExpenses(prev => [{ id: Date.now().toString(), category: expCat, amount: amt, comment: expNote, date: today() }, ...prev]);
    setExpAmt(''); setExpNote('');
  };

  const addIncome = () => {
    const amt = parseFloat(incAmt.replace(/\s/g, '').replace(',', '.'));
    if (!amt || amt <= 0) return;
    setIncomes(prev => [{ id: Date.now().toString(), who: incWho, amount: amt, comment: incNote, date: today() }, ...prev]);
    setIncAmt(''); setIncNote('');
  };

  const removeExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const removeIncome  = (id: string) => setIncomes(prev => prev.filter(i => i.id !== id));

  const cat = (key: string) => CATEGORIES.find(c => c.key === key);
  const monthName = new Date().toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2, textTransform: 'capitalize' }}>
        📅 {monthName}
      </div>

      {/* ── ОБЩИЙ ОСТАТОК ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>💼 Общий остаток</div>

        {totalBudget === 0 ? (
          <div style={{ color: TEXT2, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Бюджет этого месяца формируется из доходов прошлого месяца.<br />
            В прошлом месяце доходов не было — бюджет 0 ₽.<br />
            <span style={{ color: ACCENT }}>Внесите доходы ниже — они станут бюджетом следующего месяца.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Бюджет месяца</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: TEXT }}>{ru(totalBudget)} ₽</div>
            </div>
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Потрачено</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: ACCENT }}>{ru(totalSpent)} ₽</div>
            </div>
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Остаток</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: totalLeft >= 0 ? GREEN : '#c0392b' }}>{ru(totalLeft)} ₽</div>
            </div>
          </div>
        )}

        {totalBudget > 0 && (
          <div style={{ marginTop: 16, height: 12, background: '#f5e6dc', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
              background: totalLeft < 0 ? '#c0392b' : `linear-gradient(90deg, ${ACCENT}, #f2a65a)`,
              borderRadius: 8, transition: 'width 0.4s'
            }} />
          </div>
        )}
      </div>

      {/* ── РАСХОДЫ ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>📤 Внести расход</div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={expCat} onChange={e => setExpCat(e.target.value)} style={selectStyle}>
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.emoji} {c.name}{c.budget > 0 ? ` (лимит ${ru(c.budget)} ₽)` : ''}</option>
            ))}
          </select>
          <input style={{ ...inputStyle, width: 150 }} placeholder="Сумма, ₽" value={expAmt}
            onChange={e => setExpAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpense()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="Комментарий" value={expNote}
            onChange={e => setExpNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpense()} />
          <button onClick={addExpense} style={btnPrimary}>Добавить</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
          {CATEGORIES.map(c => {
            const spentAmt = spent[c.key] || 0;
            const left = c.budget > 0 ? c.budget - spentAmt : null;
            const pct = c.budget > 0 ? Math.min((spentAmt / c.budget) * 100, 100) : 0;
            const over = left !== null && left < 0;
            return (
              <div key={c.key} onClick={() => setExpCat(c.key)} style={{
                background: expCat === c.key ? ACCENT_LIGHT : '#fef9f5',
                border: expCat === c.key ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                borderRadius: 16, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <div style={{ fontSize: '1.1rem' }}>{c.emoji}</div>
                <div style={{ fontSize: '0.82rem', color: TEXT2, marginTop: 2 }}>{c.name}</div>
                {c.budget > 0 ? (
                  <>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: over ? '#c0392b' : TEXT, marginTop: 4 }}>{ru(left!)} ₽</div>
                    <div style={{ fontSize: '0.75rem', color: TEXT2 }}>из {ru(c.budget)} ₽</div>
                    <div style={{ marginTop: 6, height: 5, background: '#f5e6dc', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#c0392b' : `linear-gradient(90deg,${ACCENT},#f2a65a)`, borderRadius: 4 }} />
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: ACCENT, marginTop: 4 }}>{ru(spentAmt)} ₽</div>
                )}
              </div>
            );
          })}
        </div>

        {expenses.length > 0 && (
          <>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: TEXT2, marginBottom: 10 }}>Последние расходы</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {expenses.map(e => {
                const c = cat(e.category);
                return (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef9f5', borderRadius: 12, padding: '8px 12px' }}>
                    <span>{c?.emoji}</span>
                    <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{c?.name}{e.comment ? ` — ${e.comment}` : ''}</span>
                    <span style={{ fontWeight: 700, color: ACCENT, whiteSpace: 'nowrap' }}>−{ru(e.amount)} ₽</span>
                    <span style={{ fontSize: '0.8rem', color: TEXT2 }}>{e.date}</span>
                    <button onClick={() => removeExpense(e.id)} style={btnDelete}>✕</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── ДОХОДЫ (→ бюджет следующего месяца) ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 4 }}>📥 Внести доход</div>
        <div style={{ fontSize: '0.85rem', color: TEXT2, marginBottom: 16 }}>Заработанное сейчас — это бюджет следующего месяца</div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={incWho} onChange={e => setIncWho(e.target.value)} style={selectStyle}>
            <option value="Вика">🧑‍💻 Вика</option>
            <option value="Серёжа">🎧 Серёжа</option>
          </select>
          <input style={{ ...inputStyle, width: 150 }} placeholder="Сумма, ₽" value={incAmt}
            onChange={e => setIncAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIncome()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="Комментарий" value={incNote}
            onChange={e => setIncNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIncome()} />
          <button onClick={addIncome} style={{ ...btnPrimary, background: GREEN }}>Добавить</button>
        </div>

        {incomes.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
              <div style={{ background: GREEN_LIGHT, borderRadius: 16, padding: '12px 20px', minWidth: 150 }}>
                <div style={{ fontSize: '0.78rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Итого внесено</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: GREEN }}>{ru(totalNextIncome)} ₽</div>
              </div>
              <div style={{ background: '#fef9f5', borderRadius: 16, padding: '12px 20px', minWidth: 150, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Покрытие базы (158к)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: totalNextIncome >= TOTAL_FIXED ? GREEN : ACCENT }}>
                  {totalNextIncome >= TOTAL_FIXED ? '✅ Покрыта' : `−${ru(TOTAL_FIXED - totalNextIncome)} ₽`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {incomes.map(i => (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: GREEN_LIGHT, borderRadius: 12, padding: '8px 12px' }}>
                  <span>{i.who === 'Вика' ? '🧑‍💻' : '🎧'}</span>
                  <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{i.who}{i.comment ? ` — ${i.comment}` : ''}</span>
                  <span style={{ fontWeight: 700, color: GREEN, whiteSpace: 'nowrap' }}>+{ru(i.amount)} ₽</span>
                  <span style={{ fontSize: '0.8rem', color: TEXT2 }}>{i.date}</span>
                  <button onClick={() => removeIncome(i.id)} style={btnDelete}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 12, border: '1px solid #e7d7cc',
  background: '#fffaf6', fontSize: '0.95rem', color: '#4a3b32',
  outline: 'none', fontFamily: "'Nunito', sans-serif",
};
export const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer', minWidth: 200,
};
export const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 12, border: 'none',
  background: '#e07a5f', color: 'white', fontWeight: 700,
  fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  whiteSpace: 'nowrap',
};
const btnDelete: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 8, border: '1px solid #f5e6dc',
  background: 'white', color: '#c0392b', cursor: 'pointer',
  fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif",
};
