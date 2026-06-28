import { useState, useEffect } from 'react';
import { loadSavings, saveSavings, distribute, distributeRemainder, applyDistribution, subtractFromSavings, Distribution, SAVINGS_GOAL } from '../utils/savings';

const ACCENT = '#e07a5f';
const ACCENT_LIGHT = '#fef0e7';
const CARD_BG = 'rgba(255,255,255,0.9)';
const BORDER = '#f5e6dc';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';
const BLUE = '#4a7fa5';
const BLUE_LIGHT = '#eaf3fb';

// Только «живые» категории трат (без накоплений и резерва)
export const CATEGORIES = [
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

export const TOTAL_FIXED = CATEGORIES.reduce((a, c) => a + c.budget, 0);

export type Income = { id: string; who: string; amount: number; comment: string; date: string };
type Expense = { id: string; category: string; amount: number; comment: string; date: string };
type SavingsEntry = { id: string; amount: number; comment: string; date: string; dist: Distribution; type: 'savings' | 'remainder' };

const today = () => new Date().toLocaleDateString('ru-RU');
export const ru = (n: number) => Math.round(n).toLocaleString('ru-RU');

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
  const mk  = monthKey(0);
  const pmk = monthKey(-1);

  const [expenses, setExpenses]         = useState<Expense[]>(() => loadData(mk + '_exp', []));
  const [incomes,  setIncomes]          = useState<Income[]>(() => loadData(mk + '_inc', []));
  const [savEntries, setSavEntries]     = useState<SavingsEntry[]>(() => loadData(mk + '_sav', []));

  const prevIncomes: Income[] = loadData(pmk + '_inc', []);
  const totalBudget = prevIncomes.reduce((a, i) => a + i.amount, 0);

  // формы
  const [expCat,   setExpCat]   = useState(CATEGORIES[0].key);
  const [expAmt,   setExpAmt]   = useState('');
  const [expNote,  setExpNote]  = useState('');
  const [incWho,   setIncWho]   = useState('Вика');
  const [incAmt,   setIncAmt]   = useState('');
  const [incNote,  setIncNote]  = useState('');
  const [savAmt,   setSavAmt]   = useState('');
  const [savNote,  setSavNote]  = useState('');
  const [remAmt,   setRemAmt]   = useState('');
  const [remNote,  setRemNote]  = useState('');
  // preview для заначки
  const [savPreview, setSavPreview] = useState<Distribution | null>(null);

  useEffect(() => { saveData(mk + '_exp', expenses); }, [expenses, mk]);
  useEffect(() => { saveData(mk + '_inc', incomes); }, [incomes, mk]);
  useEffect(() => { saveData(mk + '_sav', savEntries); }, [savEntries, mk]);

  const spent: Record<string, number> = {};
  for (const e of expenses) spent[e.category] = (spent[e.category] || 0) + e.amount;

  const totalSpent      = expenses.reduce((a, e) => a + e.amount, 0);
  const totalLeft       = totalBudget - totalSpent;
  const totalNextIncome = incomes.reduce((a, i) => a + i.amount, 0);

  const totalSaved    = savEntries.reduce((a, s) => a + s.amount, 0);

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

  const addSavings = () => {
    const amt = parseFloat(savAmt.replace(/\s/g, '').replace(',', '.'));
    if (!amt || amt <= 0) return;
    const state = loadSavings();
    const dist  = distribute(amt, state);
    saveSavings(applyDistribution(state, dist));
    setSavEntries(prev => [{ id: Date.now().toString(), amount: amt, comment: savNote, date: today(), dist, type: 'savings' }, ...prev]);
    setSavAmt(''); setSavNote(''); setSavPreview(null);
  };

  const addRemainder = () => {
    const amt = parseFloat(remAmt.replace(/\s/g, '').replace(',', '.'));
    if (!amt || amt <= 0) return;
    const dist = distributeRemainder(amt);
    const state = loadSavings();
    saveSavings(applyDistribution(state, dist));
    setSavEntries(prev => [{ id: Date.now().toString(), amount: amt, comment: remNote, date: today(), dist, type: 'remainder' }, ...prev]);
    setRemAmt(''); setRemNote('');
  };

  const removeSavEntry = (entry: SavingsEntry) => {
    const state = loadSavings();
    saveSavings(subtractFromSavings(state, entry.dist));
    setSavEntries(prev => prev.filter(s => s.id !== entry.id));
  };

  const removeExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const removeIncome  = (id: string) => setIncomes(prev => prev.filter(i => i.id !== id));

  const handleSavAmtChange = (val: string) => {
    setSavAmt(val);
    const amt = parseFloat(val.replace(/\s/g, '').replace(',', '.'));
    if (amt > 0) {
      setSavPreview(distribute(amt, loadSavings()));
    } else {
      setSavPreview(null);
    }
  };

  const cat = (key: string) => CATEGORIES.find(c => c.key === key);
  const monthName = new Date().toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2, textTransform: 'capitalize' }}>
        📅 {monthName}
      </div>

      {/* ── ОБЩИЙ ОСТАТОК ── */}
      <div style={card}>
        <div style={title}>💼 Общий остаток</div>
        {totalBudget === 0 ? (
          <div style={{ color: TEXT2, fontSize: '0.95rem', lineHeight: 1.7 }}>
            Бюджет этого месяца формируется из доходов прошлого месяца.<br />
            В прошлом месяце доходов не было — бюджет 0 ₽.<br />
            <span style={{ color: ACCENT }}>Внесите доходы ниже — они станут бюджетом следующего месяца.</span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <StatBox label="Бюджет месяца" value={`${ru(totalBudget)} ₽`} color={TEXT} />
              <StatBox label="Потрачено" value={`${ru(totalSpent)} ₽`} color={ACCENT} />
              <StatBox label="Остаток" value={`${ru(totalLeft)} ₽`} color={totalLeft >= 0 ? GREEN : '#c0392b'} />
              {totalSaved > 0 && <StatBox label="В заначку" value={`${ru(totalSaved)} ₽`} color={BLUE} />}
            </div>
            <div style={{ marginTop: 14, height: 10, background: '#f5e6dc', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, background: totalLeft < 0 ? '#c0392b' : `linear-gradient(90deg,${ACCENT},#f2a65a)`, borderRadius: 8, transition: 'width 0.4s' }} />
            </div>
          </>
        )}
      </div>

      {/* ── РАСХОДЫ ── */}
      <div style={card}>
        <div style={title}>📤 Внести расход</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={expCat} onChange={e => setExpCat(e.target.value)} style={selectStyle}>
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.emoji} {c.name} (лимит {ru(c.budget)} ₽)</option>
            ))}
          </select>
          <input style={{ ...inputStyle, width: 140 }} placeholder="Сумма, ₽" value={expAmt}
            onChange={e => setExpAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpense()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 130 }} placeholder="Комментарий" value={expNote}
            onChange={e => setExpNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExpense()} />
          <button onClick={addExpense} style={btnPrimary}>Добавить</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10, marginBottom: 20 }}>
          {CATEGORIES.map(c => {
            const spentAmt = spent[c.key] || 0;
            const left = c.budget - spentAmt;
            const pct  = Math.min((spentAmt / c.budget) * 100, 100);
            const over = left < 0;
            return (
              <div key={c.key} onClick={() => setExpCat(c.key)} style={{
                background: expCat === c.key ? ACCENT_LIGHT : '#fef9f5',
                border: expCat === c.key ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                borderRadius: 16, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <div>{c.emoji}</div>
                <div style={{ fontSize: '0.82rem', color: TEXT2, marginTop: 2 }}>{c.name}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: over ? '#c0392b' : TEXT, marginTop: 4 }}>{ru(left)} ₽</div>
                <div style={{ fontSize: '0.75rem', color: TEXT2 }}>из {ru(c.budget)} ₽</div>
                <div style={{ marginTop: 6, height: 5, background: '#f5e6dc', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: over ? '#c0392b' : `linear-gradient(90deg,${ACCENT},#f2a65a)`, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {expenses.length > 0 && (
          <>
            <div style={subTitle}>Последние расходы</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {expenses.map(e => {
                const c = cat(e.category);
                return (
                  <div key={e.id} style={row('#fef9f5')}>
                    <span>{c?.emoji}</span>
                    <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{c?.name}{e.comment ? ` — ${e.comment}` : ''}</span>
                    <span style={{ fontWeight: 700, color: ACCENT, whiteSpace: 'nowrap' }}>−{ru(e.amount)} ₽</span>
                    <span style={{ fontSize: '0.78rem', color: TEXT2 }}>{e.date}</span>
                    <button onClick={() => removeExpense(e.id)} style={btnDel}>✕</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── В ЗАНАЧКУ ── */}
      <div style={card}>
        <div style={title}>🏦 В заначку</div>
        <div style={{ fontSize: '0.85rem', color: TEXT2, marginBottom: 16, lineHeight: 1.6 }}>
          До {ru(SAVINGS_GOAL)} ₽ — делится поровну между подушками (пока не накоплено по 500к), потом на дом.<br />
          Свыше {ru(SAVINGS_GOAL)} ₽ — всё сверх идёт в основной резерв.
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: savPreview ? 14 : 20 }}>
          <input style={{ ...inputStyle, width: 160 }} placeholder="Сумма, ₽" value={savAmt}
            onChange={e => handleSavAmtChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSavings()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 130 }} placeholder="Комментарий" value={savNote}
            onChange={e => setSavNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSavings()} />
          <button onClick={addSavings} style={{ ...btnPrimary, background: BLUE }}>Положить в заначку</button>
        </div>

        {/* Preview распределения */}
        {savPreview && (
          <div style={{ background: BLUE_LIGHT, borderRadius: 16, padding: '12px 16px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <span style={{ fontSize: '0.82rem', color: BLUE, fontWeight: 700, width: '100%' }}>Как распределится:</span>
            {savPreview.pillow1 > 0 && <PreviewItem label="🛡️ Подушка 1" val={savPreview.pillow1} color={BLUE} />}
            {savPreview.pillow2 > 0 && <PreviewItem label="🛡️ Подушка 2" val={savPreview.pillow2} color={BLUE} />}
            {savPreview.house   > 0 && <PreviewItem label="🏠 На дом"    val={savPreview.house}   color={GREEN} />}
            {savPreview.reserve > 0 && <PreviewItem label="💰 Резерв"    val={savPreview.reserve} color={ACCENT} />}
          </div>
        )}

        {/* Остаток от расходов → резерв */}
        <div style={{ borderTop: `1px dashed ${BORDER}`, paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: TEXT, marginBottom: 8 }}>💰 Остаток от расходов → в резерв</div>
          <div style={{ fontSize: '0.83rem', color: TEXT2, marginBottom: 12 }}>
            Всё, что осталось от базовых трат в конце месяца, идёт в основной резерв.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input style={{ ...inputStyle, width: 160 }} placeholder="Сумма, ₽" value={remAmt}
              onChange={e => setRemAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRemainder()} />
            <input style={{ ...inputStyle, flex: 1, minWidth: 130 }} placeholder="Комментарий" value={remNote}
              onChange={e => setRemNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRemainder()} />
            <button onClick={addRemainder} style={{ ...btnPrimary, background: GREEN }}>В резерв</button>
          </div>
        </div>

        {/* История заначки */}
        {savEntries.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={subTitle}>История</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {savEntries.map(s => (
                <div key={s.id} style={row(s.type === 'savings' ? BLUE_LIGHT : GREEN_LIGHT)}>
                  <span>{s.type === 'savings' ? '🏦' : '💰'}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.9rem', color: TEXT }}>
                      {s.type === 'savings' ? 'В заначку' : 'В резерв'}{s.comment ? ` — ${s.comment}` : ''}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: TEXT2, marginTop: 2 }}>
                      {s.type === 'savings' && [
                        s.dist.pillow1 > 0 && `🛡️ п1: ${ru(s.dist.pillow1)}₽`,
                        s.dist.pillow2 > 0 && `🛡️ п2: ${ru(s.dist.pillow2)}₽`,
                        s.dist.house   > 0 && `🏠 дом: ${ru(s.dist.house)}₽`,
                        s.dist.reserve > 0 && `💰 резерв: ${ru(s.dist.reserve)}₽`,
                      ].filter(Boolean).join(' · ')}
                      {s.type === 'remainder' && `💰 резерв: ${ru(s.dist.reserve)} ₽`}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: s.type === 'savings' ? BLUE : GREEN, whiteSpace: 'nowrap' }}>+{ru(s.amount)} ₽</span>
                  <span style={{ fontSize: '0.78rem', color: TEXT2 }}>{s.date}</span>
                  <button onClick={() => removeSavEntry(s)} style={btnDel}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ДОХОДЫ → след. месяц ── */}
      <div style={card}>
        <div style={title}>📥 Внести доход</div>
        <div style={{ fontSize: '0.85rem', color: TEXT2, marginBottom: 16 }}>Заработанное сейчас — это бюджет следующего месяца</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={incWho} onChange={e => setIncWho(e.target.value)} style={selectStyle}>
            <option value="Вика">🧑‍💻 Вика</option>
            <option value="Серёжа">🎧 Серёжа</option>
          </select>
          <input style={{ ...inputStyle, width: 140 }} placeholder="Сумма, ₽" value={incAmt}
            onChange={e => setIncAmt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIncome()} />
          <input style={{ ...inputStyle, flex: 1, minWidth: 130 }} placeholder="Комментарий" value={incNote}
            onChange={e => setIncNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIncome()} />
          <button onClick={addIncome} style={{ ...btnPrimary, background: GREEN }}>Добавить</button>
        </div>
        {incomes.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
              <MiniStat label="Итого внесено" val={`${ru(totalNextIncome)} ₽`} bg={GREEN_LIGHT} color={GREEN} />
              <MiniStat
                label="Покрытие базы (158к)"
                val={totalNextIncome >= TOTAL_FIXED ? '✅ Покрыта' : `−${ru(TOTAL_FIXED - totalNextIncome)} ₽`}
                bg="#fef9f5" color={totalNextIncome >= TOTAL_FIXED ? GREEN : ACCENT}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {incomes.map(i => (
                <div key={i.id} style={row(GREEN_LIGHT)}>
                  <span>{i.who === 'Вика' ? '🧑‍💻' : '🎧'}</span>
                  <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{i.who}{i.comment ? ` — ${i.comment}` : ''}</span>
                  <span style={{ fontWeight: 700, color: GREEN, whiteSpace: 'nowrap' }}>+{ru(i.amount)} ₽</span>
                  <span style={{ fontSize: '0.78rem', color: TEXT2 }}>{i.date}</span>
                  <button onClick={() => removeIncome(i.id)} style={btnDel}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Вспомогательные компоненты ──

const StatBox = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{ flex: 1, minWidth: 120 }}>
    <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '1.9rem', fontWeight: 700, color }}>{value}</div>
  </div>
);

const MiniStat = ({ label, val, bg, color }: { label: string; val: string; bg: string; color: string }) => (
  <div style={{ background: bg, borderRadius: 16, padding: '12px 18px', minWidth: 140, border: `1px solid ${BORDER}` }}>
    <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{val}</div>
  </div>
);

const PreviewItem = ({ label, val, color }: { label: string; val: number; color: string }) => (
  <div>
    <div style={{ fontSize: '0.78rem', color: TEXT2 }}>{label}</div>
    <div style={{ fontWeight: 700, color }}>{ru(val)} ₽</div>
  </div>
);

const row = (bg: string): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  background: bg, borderRadius: 12, padding: '8px 12px',
});

const card: React.CSSProperties = {
  background: CARD_BG, borderRadius: 24, padding: 24,
  border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
};
const title: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 };
const subTitle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 700, color: TEXT2, marginBottom: 10 };

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
  background: ACCENT, color: 'white', fontWeight: 700,
  fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  whiteSpace: 'nowrap',
};
const btnDel: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 8, border: '1px solid #f5e6dc',
  background: 'white', color: '#c0392b', cursor: 'pointer',
  fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif",
};
