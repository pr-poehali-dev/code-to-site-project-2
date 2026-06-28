import { useState, useEffect } from 'react';

const ACCENT = '#e07a5f';
const ACCENT_LIGHT = '#fef0e7';
const BG = 'linear-gradient(135deg, #fdf6f0 0%, #f9eae4 100%)';
const CARD_BG = 'rgba(255,255,255,0.9)';
const BORDER = '#f5e6dc';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';

const CATEGORIES = [
  { key: 'rent',    name: 'Аренда',                 budget: 30000, emoji: '🏠' },
  { key: 'credit',  name: 'Кредиты',                budget: 30000, emoji: '💳' },
  { key: 'food',    name: 'Продукты',               budget: 25000, emoji: '🛒' },
  { key: 'fun',     name: 'Радости и развлечения',  budget: 20000, emoji: '🎉' },
  { key: 'trans',   name: 'Транспорт',              budget: 8000,  emoji: '🚗' },
  { key: 'pets',    name: 'Животные',               budget: 5000,  emoji: '🐱' },
  { key: 'beauty',  name: 'Красота/здоровье',       budget: 5000,  emoji: '💆' },
  { key: 'comm',    name: 'Связь',                  budget: 3500,  emoji: '📱' },
  { key: 'chem',    name: 'Бытовая химия',          budget: 1500,  emoji: '🧴' },
  { key: 'sergey',  name: 'Личные Серёжи',          budget: 15000, emoji: '🎧' },
  { key: 'vika',    name: 'Личные Вики',            budget: 15000, emoji: '🧑‍💻' },
  { key: 'savings', name: 'Накопления',             budget: 0,     emoji: '🏦' },
  { key: 'reserve', name: 'Основной резерв',        budget: 0,     emoji: '💰' },
];

const TOTAL_FIXED = CATEGORIES.filter(c => c.budget > 0).reduce((a, c) => a + c.budget, 0);

type Expense = { id: string; category: string; amount: number; comment: string; date: string };
type Income  = { id: string; who: string; amount: number; comment: string; date: string };

const today = () => new Date().toLocaleDateString('ru-RU');
const ru = (n: number) => Math.round(n).toLocaleString('ru-RU');

const MONTH_KEY = () => {
  const d = new Date();
  return `budget_${d.getFullYear()}_${d.getMonth()}`;
};

function load<T>(key: string, def: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) { /* ignore */ }
}

export default function CurrentMonth() {
  const mk = MONTH_KEY();

  const [expenses, setExpenses]   = useState<Expense[]>(() => load(mk + '_exp', []));
  const [incomes, setIncomes]     = useState<Income[]>(() => load(mk + '_inc', []));
  const [totalBudget, setTotalBudget] = useState<number>(() => load(mk + '_budget', 0));

  // форма расхода
  const [expCat,  setExpCat]     = useState(CATEGORIES[0].key);
  const [expAmt,  setExpAmt]     = useState('');
  const [expNote, setExpNote]    = useState('');

  // форма дохода
  const [incWho,  setIncWho]     = useState('Вика');
  const [incAmt,  setIncAmt]     = useState('');
  const [incNote, setIncNote]    = useState('');

  // начальный бюджет
  const [budgetInput, setBudgetInput] = useState('');
  const [showBudget, setShowBudget]   = useState(false);

  useEffect(() => { save(mk + '_exp', expenses); }, [expenses, mk]);
  useEffect(() => { save(mk + '_inc', incomes); }, [incomes, mk]);
  useEffect(() => { save(mk + '_budget', totalBudget); }, [totalBudget, mk]);

  // Сколько потрачено по каждой категории
  const spent: Record<string, number> = {};
  for (const e of expenses) {
    spent[e.category] = (spent[e.category] || 0) + e.amount;
  }

  // Общий остаток = введённый бюджет - все расходы
  const totalSpent = expenses.reduce((a, e) => a + e.amount, 0);
  const totalLeft  = totalBudget - totalSpent;

  const addExpense = () => {
    const amt = parseFloat(expAmt.replace(/\s/g, '').replace(',', '.'));
    if (!amt || amt <= 0) return;
    const newExp: Expense = { id: Date.now().toString(), category: expCat, amount: amt, comment: expNote, date: today() };
    setExpenses(prev => [newExp, ...prev]);
    setExpAmt(''); setExpNote('');
  };

  const addIncome = () => {
    const amt = parseFloat(incAmt.replace(/\s/g, '').replace(',', '.'));
    if (!amt || amt <= 0) return;
    const newInc: Income = { id: Date.now().toString(), who: incWho, amount: amt, comment: incNote, date: today() };
    setIncomes(prev => [newInc, ...prev]);
    setIncAmt(''); setIncNote('');
  };

  const removeExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const removeIncome  = (id: string) => setIncomes(prev => prev.filter(i => i.id !== id));

  const saveBudget = () => {
    const v = parseFloat(budgetInput.replace(/\s/g, '').replace(',', '.'));
    if (v > 0) { setTotalBudget(v); setBudgetInput(''); setShowBudget(false); }
  };

  const totalNextIncome = incomes.reduce((a, i) => a + i.amount, 0);

  const cat = (key: string) => CATEGORIES.find(c => c.key === key);

  const monthName = new Date().toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── ЗАГОЛОВОК ── */}
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2, textTransform: 'capitalize' }}>
        📅 {monthName}
      </div>

      {/* ── ОБЩИЙ ОСТАТОК ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>💼 Общий остаток</div>

        {totalBudget === 0 ? (
          <div style={{ color: TEXT2, fontSize: '0.95rem' }}>
            Введите бюджет на этот месяц — сумму доходов, заработанных в прошлом месяце.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: '0.8rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Бюджет месяца</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: TEXT }}>{ru(totalBudget)} ₽</div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: '0.8rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Потрачено</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: ACCENT }}>{ru(totalSpent)} ₽</div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: '0.8rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Остаток</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: totalLeft >= 0 ? GREEN : '#c0392b' }}>{ru(totalLeft)} ₽</div>
            </div>
          </div>
        )}

        {/* Прогресс-бар */}
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

        {/* Кнопка установки/смены бюджета */}
        <div style={{ marginTop: 14 }}>
          {!showBudget ? (
            <button onClick={() => setShowBudget(true)} style={btnOutline}>
              {totalBudget === 0 ? '+ Установить бюджет месяца' : '✏️ Изменить бюджет'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                style={inputStyle}
                placeholder="Сумма, ₽"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveBudget()}
                autoFocus
              />
              <button onClick={saveBudget} style={btnPrimary}>Сохранить</button>
              <button onClick={() => setShowBudget(false)} style={btnOutline}>Отмена</button>
            </div>
          )}
        </div>
      </div>

      {/* ── РАСХОДЫ ПО КАТЕГОРИЯМ ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>📤 Внести расход</div>

        {/* Форма */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={expCat} onChange={e => setExpCat(e.target.value)} style={selectStyle}>
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.emoji} {c.name}{c.budget > 0 ? ` (лимит ${ru(c.budget)} ₽)` : ''}</option>
            ))}
          </select>
          <input style={{ ...inputStyle, width: 150 }} placeholder="Сумма, ₽" value={expAmt} onChange={e => setExpAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpense()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="Комментарий (необязательно)" value={expNote} onChange={e => setExpNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpense()} />
          <button onClick={addExpense} style={btnPrimary}>Добавить</button>
        </div>

        {/* Категории с остатками */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 20 }}>
          {CATEGORIES.map(c => {
            const spentAmt = spent[c.key] || 0;
            const left = c.budget > 0 ? c.budget - spentAmt : null;
            const pct = c.budget > 0 ? Math.min((spentAmt / c.budget) * 100, 100) : 0;
            const over = left !== null && left < 0;
            return (
              <div
                key={c.key}
                onClick={() => setExpCat(c.key)}
                style={{
                  background: expCat === c.key ? ACCENT_LIGHT : '#fef9f5',
                  border: expCat === c.key ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                  borderRadius: 16, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: '1.1rem' }}>{c.emoji}</div>
                <div style={{ fontSize: '0.82rem', color: TEXT2, marginTop: 2 }}>{c.name}</div>
                {c.budget > 0 ? (
                  <>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: over ? '#c0392b' : TEXT, marginTop: 4 }}>
                      {ru(left!)} ₽
                    </div>
                    <div style={{ fontSize: '0.75rem', color: TEXT2 }}>из {ru(c.budget)} ₽</div>
                    <div style={{ marginTop: 6, height: 5, background: '#f5e6dc', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#c0392b' : `linear-gradient(90deg,${ACCENT},#f2a65a)`, borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: ACCENT, marginTop: 4 }}>{ru(spentAmt)} ₽</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Последние расходы */}
        {expenses.length > 0 && (
          <>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: TEXT2, marginBottom: 10 }}>Последние расходы</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {expenses.map(e => {
                const c = cat(e.category);
                return (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef9f5', borderRadius: 12, padding: '8px 12px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{c?.emoji}</span>
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

      {/* ── ДОХОД СЛЕДУЮЩЕГО МЕСЯЦА ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 6 }}>📥 Внести доход</div>
        <div style={{ fontSize: '0.85rem', color: TEXT2, marginBottom: 16 }}>Заработанное сейчас — это бюджет следующего месяца</div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={incWho} onChange={e => setIncWho(e.target.value)} style={selectStyle}>
            <option value="Вика">🧑‍💻 Вика</option>
            <option value="Серёжа">🎧 Серёжа</option>
          </select>
          <input style={{ ...inputStyle, width: 150 }} placeholder="Сумма, ₽" value={incAmt} onChange={e => setIncAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIncome()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="Комментарий (необязательно)" value={incNote} onChange={e => setIncNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIncome()} />
          <button onClick={addIncome} style={{ ...btnPrimary, background: GREEN, borderColor: GREEN }}>Добавить</button>
        </div>

        {incomes.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ background: GREEN_LIGHT, borderRadius: 16, padding: '12px 20px', minWidth: 160 }}>
                <div style={{ fontSize: '0.8rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Итого внесено</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: GREEN }}>{ru(totalNextIncome)} ₽</div>
              </div>
              <div style={{ background: '#fef9f5', borderRadius: 16, padding: '12px 20px', minWidth: 160, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: '0.8rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Покрытие базы (158к)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: totalNextIncome >= TOTAL_FIXED ? GREEN : ACCENT }}>
                  {totalNextIncome >= TOTAL_FIXED ? '✅ Покрыта' : `−${ru(TOTAL_FIXED - totalNextIncome)} ₽`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {incomes.map(i => (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: GREEN_LIGHT, borderRadius: 12, padding: '8px 12px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{i.who === 'Вика' ? '🧑‍💻' : '🎧'}</span>
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

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 12, border: '1px solid #e7d7cc',
  background: '#fffaf6', fontSize: '0.95rem', color: '#4a3b32',
  outline: 'none', fontFamily: "'Nunito', sans-serif",
};
const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer', minWidth: 200,
};
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 12, border: 'none',
  background: '#e07a5f', color: 'white', fontWeight: 700,
  fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  whiteSpace: 'nowrap',
};
const btnOutline: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 12, border: '1px solid #e7d7cc',
  background: '#fffaf6', color: '#5c4a3e', fontWeight: 600,
  fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  whiteSpace: 'nowrap',
};
const btnDelete: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 8, border: '1px solid #f5e6dc',
  background: 'white', color: '#c0392b', cursor: 'pointer',
  fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif",
};