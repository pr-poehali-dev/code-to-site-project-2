import { useState } from 'react';
import { loadCategories, saveCategories, resetCategories, totalBudget, EMOJI_OPTIONS, Category } from '../utils/categories';

const ACCENT = '#e07a5f';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const BORDER = '#f5e6dc';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';
const RED = '#c0392b';
const RED_LIGHT = '#fdecea';

const field: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 10, border: `1px solid ${BORDER}`,
  background: '#fffaf6', fontSize: '0.9rem', color: TEXT,
  outline: 'none', fontFamily: "'Nunito', sans-serif",
};
const btn = (bg: string, small = false): React.CSSProperties => ({
  padding: small ? '5px 12px' : '9px 18px',
  borderRadius: 10, border: 'none', background: bg, color: 'white',
  fontWeight: 700, fontSize: small ? '0.82rem' : '0.9rem',
  cursor: 'pointer', fontFamily: "'Nunito', sans-serif", whiteSpace: 'nowrap',
});
const btnGhost = (color = TEXT2): React.CSSProperties => ({
  padding: '5px 12px', borderRadius: 10, border: `1px solid ${BORDER}`,
  background: '#fffaf6', color, fontWeight: 600, fontSize: '0.82rem',
  cursor: 'pointer', fontFamily: "'Nunito', sans-serif", whiteSpace: 'nowrap',
});

const ru = (n: number) => Math.round(n).toLocaleString('ru-RU');
const genKey = () => 'cat_' + Date.now().toString(36);

export default function CategorySettings() {
  const [cats, setCats]           = useState<Category[]>(() => loadCategories());
  const [editIdx, setEditIdx]     = useState<number | null>(null);
  const [draft, setDraft]         = useState<Category | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg]             = useState('');
  const [isError, setIsError]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const [newCat, setNewCat]       = useState<Category>({ key: genKey(), name: '', budget: 0, emoji: '🛒' });
  const [showNewEmoji, setShowNewEmoji] = useState(false);

  const total = totalBudget(cats);

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setDraft({ ...cats[idx] });
    setShowEmoji(false);
    setShowNew(false);
  };

  const saveEdit = () => {
    if (!draft || editIdx === null) return;
    if (!draft.name.trim()) { setMsg('Введите название'); setIsError(true); return; }
    if (draft.budget < 0)   { setMsg('Бюджет не может быть отрицательным'); setIsError(true); return; }
    const next = cats.map((c, i) => i === editIdx ? { ...draft, name: draft.name.trim() } : c);
    setCats(next); saveCategories(next);
    setEditIdx(null); setDraft(null); setMsg('✅ Сохранено'); setIsError(false);
    setTimeout(() => setMsg(''), 2000);
  };

  const deleteAt = (idx: number) => {
    if (cats.length <= 1) { setMsg('Нельзя удалить последнюю категорию'); setIsError(true); return; }
    const next = cats.filter((_, i) => i !== idx);
    setCats(next); saveCategories(next);
    setEditIdx(null); setDraft(null);
  };

  const addNew = () => {
    if (!newCat.name.trim()) { setMsg('Введите название'); setIsError(true); return; }
    const next = [...cats, { ...newCat, key: genKey(), name: newCat.name.trim() }];
    setCats(next); saveCategories(next);
    setNewCat({ key: genKey(), name: '', budget: 0, emoji: '🛒' });
    setShowNew(false); setMsg('✅ Категория добавлена'); setIsError(false);
    setTimeout(() => setMsg(''), 2000);
  };

  const doReset = () => {
    resetCategories();
    setCats(loadCategories());
    setMsg('✅ Категории сброшены до стандартных'); setIsError(false);
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: TEXT }}>📂 Категории расходов</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: TEXT2 }}>Итого: <strong style={{ color: TEXT }}>{ru(total)} ₽</strong></span>
          <button onClick={doReset} style={btnGhost(RED)}>Сбросить</button>
          <button onClick={() => { setShowNew(true); setEditIdx(null); }} style={btn(GREEN, true)}>+ Добавить</button>
        </div>
      </div>

      {msg && (
        <div style={{ fontSize: '0.88rem', color: isError ? ACCENT : GREEN, background: isError ? RED_LIGHT : GREEN_LIGHT, padding: '8px 14px', borderRadius: 10 }}>
          {msg}
        </div>
      )}

      {/* Форма новой категории */}
      {showNew && (
        <div style={{ background: GREEN_LIGHT, borderRadius: 16, padding: 16, border: `1px solid #c8e6d0`, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700, color: GREEN, fontSize: '0.9rem' }}>Новая категория</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setShowNewEmoji(v => !v)} style={{ ...field, cursor: 'pointer', fontSize: '1.3rem', width: 48, textAlign: 'center', padding: '6px' }}>
              {newCat.emoji}
            </button>
            <input style={{ ...field, flex: 1, minWidth: 140 }} placeholder="Название" value={newCat.name}
              onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} />
            <input style={{ ...field, width: 130 }} placeholder="Бюджет, ₽" type="number" min="0"
              value={newCat.budget || ''} onChange={e => setNewCat(p => ({ ...p, budget: +e.target.value }))} />
            <button onClick={addNew} style={btn(GREEN, true)}>Добавить</button>
            <button onClick={() => setShowNew(false)} style={btnGhost()}>Отмена</button>
          </div>
          {showNewEmoji && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
              {EMOJI_OPTIONS.map(e => (
                <button key={e} onClick={() => { setNewCat(p => ({ ...p, emoji: e })); setShowNewEmoji(false); }}
                  style={{ fontSize: '1.3rem', background: 'white', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Список категорий */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cats.map((c, idx) => {
          const isEdit = editIdx === idx;
          return (
            <div key={c.key} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 16, border: `1px solid ${isEdit ? ACCENT : BORDER}`, overflow: 'hidden', transition: 'border 0.15s' }}>
              {/* Строка категории */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.3rem' }}>{c.emoji}</span>
                <span style={{ flex: 1, fontWeight: 600, color: TEXT, minWidth: 100 }}>{c.name}</span>
                <span style={{ fontWeight: 700, color: ACCENT, minWidth: 80, textAlign: 'right' }}>{ru(c.budget)} ₽</span>
                <button onClick={() => isEdit ? setEditIdx(null) : startEdit(idx)} style={btnGhost(isEdit ? ACCENT : TEXT2)}>
                  {isEdit ? 'Свернуть' : '✏️ Изменить'}
                </button>
              </div>

              {/* Форма редактирования */}
              {isEdit && draft && (
                <div style={{ borderTop: `1px solid ${BORDER}`, padding: '14px 16px', background: '#fffaf6', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Эмодзи-пикер */}
                    <button onClick={() => setShowEmoji(v => !v)}
                      style={{ ...field, cursor: 'pointer', fontSize: '1.3rem', width: 48, textAlign: 'center', padding: '6px' }}>
                      {draft.emoji}
                    </button>
                    <input style={{ ...field, flex: 1, minWidth: 140 }} placeholder="Название"
                      value={draft.name} onChange={e => setDraft(p => p ? { ...p, name: e.target.value } : p)} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input style={{ ...field, width: 130 }} placeholder="Бюджет, ₽" type="number" min="0"
                        value={draft.budget || ''} onChange={e => setDraft(p => p ? { ...p, budget: +e.target.value } : p)} />
                      <span style={{ fontSize: '0.85rem', color: TEXT2 }}>₽/мес</span>
                    </div>
                  </div>
                  {showEmoji && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 130, overflowY: 'auto' }}>
                      {EMOJI_OPTIONS.map(e => (
                        <button key={e} onClick={() => { setDraft(p => p ? { ...p, emoji: e } : p); setShowEmoji(false); }}
                          style={{ fontSize: '1.3rem', background: draft.emoji === e ? '#fef0e7' : 'white', border: `1px solid ${draft.emoji === e ? ACCENT : BORDER}`, borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={saveEdit} style={btn(ACCENT, true)}>Сохранить</button>
                    <button onClick={() => { setEditIdx(null); setDraft(null); }} style={btnGhost()}>Отмена</button>
                    <button onClick={() => deleteAt(idx)} style={btnGhost(RED)}>🗑 Удалить</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.82rem', color: TEXT2, lineHeight: 1.6, paddingTop: 4 }}>
        Изменения применяются сразу в разделе «Текущий месяц».<br />
        История расходов по старым категориям сохраняется.
      </div>
    </div>
  );
}
