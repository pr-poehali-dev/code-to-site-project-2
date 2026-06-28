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

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 12, border: '1px solid #e7d7cc',
  background: '#fffaf6', fontSize: '0.95rem', color: '#4a3b32',
  outline: 'none', fontFamily: "'Nunito', sans-serif", width: 180,
};
const btn = (bg: string): React.CSSProperties => ({
  padding: '10px 18px', borderRadius: 12, border: 'none',
  background: bg, color: 'white', fontWeight: 700,
  fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  whiteSpace: 'nowrap',
});

type Goal = {
  key: keyof ReturnType<typeof loadSavings>;
  label: string;
  emoji: string;
  target: number | null;
  color: string;
  bg: string;
  desc: string;
};

const GOALS: Goal[] = [
  { key: 'pillow1', label: 'Неприкасаемая подушка', emoji: '🛡️', target: PILLOW_TARGET, color: BLUE,  bg: BLUE_LIGHT,  desc: 'ЧП — болезнь, потеря дееспособности' },
  { key: 'pillow2', label: 'Полунеприкасаемая подушка', emoji: '🛡️', target: PILLOW_TARGET, color: '#7b5ea7', bg: '#f3eefb', desc: 'Пустые месяцы при нулевом резерве' },
  { key: 'house',   label: 'Накопления на дом',     emoji: '🏠', target: HOUSE_TARGET,  color: GREEN, bg: GREEN_LIGHT, desc: `Цель — ${(HOUSE_TARGET / 1_000_000).toFixed(1)} млн ₽` },
  { key: 'reserve', label: 'Основной резерв',        emoji: '💰', target: null,          color: ACCENT, bg: '#fef0e7', desc: 'Совместные траты, непредвиденные расходы' },
];

export default function Savings() {
  const [savings, setSavings] = useState(loadSavings);
  const [editing, setEditing] = useState<keyof ReturnType<typeof loadSavings> | null>(null);
  const [editVal, setEditVal] = useState('');

  const startEdit = (key: keyof ReturnType<typeof loadSavings>) => {
    setEditing(key);
    setEditVal(String(savings[key]));
  };

  const saveEdit = () => {
    if (!editing) return;
    const val = parseFloat(editVal.replace(/\s/g, '').replace(',', '.'));
    if (isNaN(val) || val < 0) return;
    const next = { ...savings, [editing]: val };
    setSavings(next);
    saveSavings(next);
    setEditing(null);
  };

  const totalPillows = savings.pillow1 + savings.pillow2;
  const pillowTarget = PILLOW_TARGET * 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2 }}>💰 Накопления</div>

      {/* Сводка */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>📊 Общая картина</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 150, background: BLUE_LIGHT, borderRadius: 18, padding: '14px 18px' }}>
            <div style={{ fontSize: '0.78rem', color: BLUE, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Подушки безопасности</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: BLUE }}>{ru(totalPillows)} ₽</div>
            <div style={{ fontSize: '0.82rem', color: TEXT2 }}>из {ru(pillowTarget)} ₽</div>
            <div style={{ marginTop: 8, height: 8, background: 'rgba(74,127,165,0.15)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((totalPillows / pillowTarget) * 100, 100)}%`, background: BLUE, borderRadius: 6, transition: 'width 0.4s' }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 150, background: GREEN_LIGHT, borderRadius: 18, padding: '14px 18px' }}>
            <div style={{ fontSize: '0.78rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.5px' }}>На дом</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: GREEN }}>{ru(savings.house)} ₽</div>
            <div style={{ fontSize: '0.82rem', color: TEXT2 }}>из {ru(HOUSE_TARGET)} ₽</div>
            <div style={{ marginTop: 8, height: 8, background: 'rgba(90,154,110,0.15)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((savings.house / HOUSE_TARGET) * 100, 100)}%`, background: GREEN, borderRadius: 6, transition: 'width 0.4s' }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 150, background: '#fef0e7', borderRadius: 18, padding: '14px 18px' }}>
            <div style={{ fontSize: '0.78rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Основной резерв</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: ACCENT }}>{ru(savings.reserve)} ₽</div>
            <div style={{ fontSize: '0.82rem', color: TEXT2 }}>без целевого лимита</div>
          </div>
        </div>
      </div>

      {/* Карточки целей */}
      {GOALS.map(g => {
        const current = savings[g.key];
        const pct = g.target ? Math.min((current / g.target) * 100, 100) : null;
        const done = g.target ? current >= g.target : false;
        const isEdit = editing === g.key;

        return (
          <div key={g.key} style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: TEXT }}>{g.emoji} {g.label}</div>
                <div style={{ fontSize: '0.83rem', color: TEXT2, marginTop: 2 }}>{g.desc}</div>
              </div>
              {done && <span style={{ background: GREEN_LIGHT, color: GREEN, fontWeight: 700, padding: '4px 14px', borderRadius: 20, fontSize: '0.85rem' }}>✅ Цель достигнута</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Накоплено</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: g.color }}>{ru(current)} ₽</div>
              </div>
              {g.target && (
                <div>
                  <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Цель</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: TEXT2 }}>{ru(g.target)} ₽</div>
                </div>
              )}
              {g.target && !done && (
                <div>
                  <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Осталось</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: ACCENT }}>{ru(g.target - current)} ₽</div>
                </div>
              )}
            </div>

            {pct !== null && (
              <div style={{ marginTop: 12, height: 14, background: '#f5e6dc', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: done ? GREEN : `linear-gradient(90deg, ${g.color}, ${g.color}aa)`, borderRadius: 8, transition: 'width 0.4s' }} />
              </div>
            )}
            {pct !== null && (
              <div style={{ fontSize: '0.8rem', color: TEXT2, marginTop: 4 }}>{pct.toFixed(1)}%</div>
            )}

            {/* Ручная корректировка */}
            <div style={{ marginTop: 14 }}>
              {!isEdit ? (
                <button onClick={() => startEdit(g.key)} style={{ padding: '6px 14px', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fffaf6', color: TEXT2, cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Nunito', sans-serif" }}>
                  ✏️ Изменить вручную
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    style={inputStyle} autoFocus value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    placeholder="Новая сумма, ₽"
                  />
                  <button onClick={saveEdit} style={btn(g.color)}>Сохранить</button>
                  <button onClick={() => setEditing(null)} style={{ ...btn(TEXT2) }}>Отмена</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}