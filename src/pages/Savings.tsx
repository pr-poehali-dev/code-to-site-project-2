import { useState } from 'react';
import { loadSavings, saveSavings, PILLOW_TARGET, HOUSE_TARGET } from '../utils/savings';
import { ru } from './CurrentMonth';

const CARD_BG = 'rgba(255,255,255,0.9)';
const BORDER = '#f5e6dc';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';
const ACCENT = '#e07a5f';
const BLUE = '#4a7fa5';
const BLUE_LIGHT = '#eaf3fb';
const RED = '#c0392b';
const RED_LIGHT = '#fdecea';

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 12, border: '1px solid #e7d7cc',
  background: '#fffaf6', fontSize: '0.95rem', color: '#4a3b32',
  outline: 'none', fontFamily: "'Nunito', sans-serif", width: 180,
};
const btnStyle = (bg: string): React.CSSProperties => ({
  padding: '10px 18px', borderRadius: 12, border: 'none',
  background: bg, color: 'white', fontWeight: 700,
  fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  whiteSpace: 'nowrap',
});
const btnOutline: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 10, border: `1px solid #e7d7cc`,
  background: '#fffaf6', color: TEXT2, cursor: 'pointer',
  fontSize: '0.85rem', fontFamily: "'Nunito', sans-serif", whiteSpace: 'nowrap',
};

type SavingsKey = 'pillow1' | 'pillow2' | 'house' | 'reserve';

type Goal = {
  key: SavingsKey;
  label: string;
  emoji: string;
  target: number | null;
  color: string;
  bg: string;
  desc: string;
  withdrawWarning?: string;
};

const GOALS: Goal[] = [
  {
    key: 'pillow1', label: 'Неприкасаемая подушка', emoji: '🛡️',
    target: PILLOW_TARGET, color: BLUE, bg: BLUE_LIGHT,
    desc: 'ЧП — болезнь, потеря дееспособности',
    withdrawWarning: 'Это неприкасаемый резерв. Снимать только в случае настоящего ЧП.',
  },
  {
    key: 'pillow2', label: 'Полунеприкасаемая подушка', emoji: '🛡️',
    target: PILLOW_TARGET, color: '#7b5ea7', bg: '#f3eefb',
    desc: 'Пустые месяцы при нулевом резерве',
    withdrawWarning: 'Снимать только когда основной резерв полностью исчерпан.',
  },
  {
    key: 'house', label: 'Накопления на дом', emoji: '🏠',
    target: HOUSE_TARGET, color: GREEN, bg: GREEN_LIGHT,
    desc: `Цель — ${(HOUSE_TARGET / 1_000_000).toFixed(1)} млн ₽`,
  },
  {
    key: 'reserve', label: 'Основной резерв', emoji: '💰',
    target: null, color: ACCENT, bg: '#fef0e7',
    desc: 'Совместные траты, непредвиденные расходы',
  },
];

type ActionMode = 'edit' | 'withdraw' | null;

export default function Savings() {
  const [savings, setSavings] = useState(loadSavings);
  const [activeKey, setActiveKey] = useState<SavingsKey | null>(null);
  const [mode, setMode] = useState<ActionMode>(null);
  const [inputVal, setInputVal] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const totalPillows = savings.pillow1 + savings.pillow2;
  const pillowTarget = PILLOW_TARGET * 2;

  const openMode = (key: SavingsKey, m: ActionMode) => {
    setActiveKey(key);
    setMode(m);
    setInputVal(m === 'edit' ? String(savings[key]) : '');
    setWithdrawNote('');
    setConfirmed(false);
  };

  const close = () => { setActiveKey(null); setMode(null); setConfirmed(false); };

  const applyEdit = () => {
    if (!activeKey) return;
    const val = parseFloat(inputVal.replace(/\s/g, '').replace(',', '.'));
    if (isNaN(val) || val < 0) return;
    const next = { ...savings, [activeKey]: val };
    setSavings(next); saveSavings(next); close();
  };

  const applyWithdraw = () => {
    if (!activeKey) return;
    const val = parseFloat(inputVal.replace(/\s/g, '').replace(',', '.'));
    if (isNaN(val) || val <= 0) return;
    const next = { ...savings, [activeKey]: Math.max(0, savings[activeKey] - val) };
    setSavings(next); saveSavings(next); close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2 }}>💰 Накопления</div>

      {/* ── СВОДКА ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>📊 Общая картина</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <SummaryCard label="Подушки безопасности" val={ru(totalPillows)} sub={`из ${ru(pillowTarget)} ₽`} color={BLUE} bg={BLUE_LIGHT} pct={(totalPillows / pillowTarget) * 100} />
          <SummaryCard label="На дом" val={ru(savings.house)} sub={`из ${ru(HOUSE_TARGET)} ₽`} color={GREEN} bg={GREEN_LIGHT} pct={(savings.house / HOUSE_TARGET) * 100} />
          <SummaryCard label="Основной резерв" val={ru(savings.reserve)} sub="без лимита" color={ACCENT} bg="#fef0e7" />
        </div>
      </div>

      {/* ── КАРТОЧКИ ЦЕЛЕЙ ── */}
      {GOALS.map(g => {
        const current = savings[g.key];
        const pct = g.target ? Math.min((current / g.target) * 100, 100) : null;
        const done = g.target ? current >= g.target : false;
        const isActive = activeKey === g.key;

        return (
          <div key={g.key} style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            {/* Шапка */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: TEXT }}>{g.emoji} {g.label}</div>
                <div style={{ fontSize: '0.83rem', color: TEXT2, marginTop: 2 }}>{g.desc}</div>
              </div>
              {done && <span style={{ background: GREEN_LIGHT, color: GREEN, fontWeight: 700, padding: '4px 14px', borderRadius: 20, fontSize: '0.85rem' }}>✅ Цель достигнута</span>}
            </div>

            {/* Суммы */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={labelStyle}>Накоплено</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: g.color }}>{ru(current)} ₽</div>
              </div>
              {g.target && <div><div style={labelStyle}>Цель</div><div style={{ fontSize: '1.4rem', fontWeight: 700, color: TEXT2 }}>{ru(g.target)} ₽</div></div>}
              {g.target && !done && <div><div style={labelStyle}>Осталось</div><div style={{ fontSize: '1.4rem', fontWeight: 700, color: ACCENT }}>{ru(g.target - current)} ₽</div></div>}
            </div>

            {/* Прогресс */}
            {pct !== null && <>
              <div style={{ marginTop: 12, height: 14, background: '#f5e6dc', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: done ? GREEN : `linear-gradient(90deg,${g.color},${g.color}99)`, borderRadius: 8, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: TEXT2, marginTop: 4 }}>{pct.toFixed(1)}%</div>
            </>}

            {/* Кнопки действий */}
            {!isActive && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                <button onClick={() => openMode(g.key, 'withdraw')} style={{ ...btnOutline, color: RED, borderColor: '#f5c6c2' }}>
                  📤 Вывести средства
                </button>
                <button onClick={() => openMode(g.key, 'edit')} style={btnOutline}>
                  ✏️ Изменить вручную
                </button>
              </div>
            )}

            {/* Форма вывода */}
            {isActive && mode === 'withdraw' && (
              <div style={{ marginTop: 16, background: RED_LIGHT, borderRadius: 18, padding: 18, border: `1px solid #f5c6c2` }}>
                {g.withdrawWarning && (
                  <div style={{ fontSize: '0.88rem', color: RED, fontWeight: 700, marginBottom: 12, lineHeight: 1.5 }}>
                    ⚠️ {g.withdrawWarning}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <input style={inputStyle} autoFocus placeholder="Сумма, ₽" value={inputVal}
                    onChange={e => { setInputVal(e.target.value); setConfirmed(false); }}
                    onKeyDown={e => e.key === 'Enter' && confirmed && applyWithdraw()} />
                  <input style={{ ...inputStyle, flex: 1, minWidth: 160 }} placeholder="Причина (обязательно)" value={withdrawNote}
                    onChange={e => { setWithdrawNote(e.target.value); setConfirmed(false); }} />
                </div>
                {/* Подтверждение для подушек */}
                {g.withdrawWarning && !confirmed && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer', fontSize: '0.88rem', color: RED }}>
                    <input type="checkbox" onChange={e => setConfirmed(e.target.checked)} />
                    Понимаю, что снимаю из защищённого резерва
                  </label>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={applyWithdraw}
                    disabled={!!g.withdrawWarning && (!confirmed || !withdrawNote.trim())}
                    style={{ ...btnStyle(RED), opacity: (!!g.withdrawWarning && (!confirmed || !withdrawNote.trim())) ? 0.5 : 1 }}
                  >
                    Вывести
                  </button>
                  <button onClick={close} style={btnStyle(TEXT2)}>Отмена</button>
                </div>
                {/* Итоговый остаток */}
                {parseFloat(inputVal) > 0 && (
                  <div style={{ marginTop: 10, fontSize: '0.88rem', color: TEXT2 }}>
                    Останется: <strong style={{ color: TEXT }}>{ru(Math.max(0, current - parseFloat(inputVal.replace(/\s/g, '').replace(',', '.'))))} ₽</strong>
                  </div>
                )}
              </div>
            )}

            {/* Форма ручного редактирования */}
            {isActive && mode === 'edit' && (
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <input style={inputStyle} autoFocus value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyEdit()}
                  placeholder="Новая сумма, ₽" />
                <button onClick={applyEdit} style={btnStyle(g.color)}>Сохранить</button>
                <button onClick={close} style={btnStyle(TEXT2)}>Отмена</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem', color: '#7b6b5e', textTransform: 'uppercase', letterSpacing: '0.5px',
};

const SummaryCard = ({ label, val, sub, color, bg, pct }: { label: string; val: string; sub: string; color: string; bg: string; pct?: number }) => (
  <div style={{ flex: 1, minWidth: 150, background: bg, borderRadius: 18, padding: '14px 18px' }}>
    <div style={{ fontSize: '0.78rem', color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '1.8rem', fontWeight: 700, color }}>{val} ₽</div>
    <div style={{ fontSize: '0.82rem', color: '#7b6b5e' }}>{sub}</div>
    {pct !== undefined && (
      <div style={{ marginTop: 8, height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 6, transition: 'width 0.4s' }} />
      </div>
    )}
  </div>
);
