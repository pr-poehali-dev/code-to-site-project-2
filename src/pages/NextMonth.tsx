import { monthKey, loadData, ru, Income, CATEGORIES, TOTAL_FIXED, inputStyle, selectStyle, btnPrimary } from './CurrentMonth';

const CARD_BG = 'rgba(255,255,255,0.9)';
const BORDER = '#f5e6dc';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const GREEN = '#5a9a6e';
const GREEN_LIGHT = '#eaf5ee';
const ACCENT = '#e07a5f';

export default function NextMonth() {
  // Доходы текущего месяца = бюджет следующего
  const mk = monthKey(0);
  const incomes: Income[] = loadData(mk + '_inc', []);
  const totalBudget = incomes.reduce((a, i) => a + i.amount, 0);

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  const nextMonthName = nextDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  const vikaTotal = incomes.filter(i => i.who === 'Вика').reduce((a, i) => a + i.amount, 0);
  const sergeyTotal = incomes.filter(i => i.who === 'Серёжа').reduce((a, i) => a + i.amount, 0);
  const surplus = totalBudget - TOTAL_FIXED;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT2, textTransform: 'capitalize' }}>
        📆 {nextMonthName}
      </div>

      {/* ── БЮДЖЕТ НА МЕСЯЦ ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 6 }}>💼 Бюджет на месяц</div>
        <div style={{ fontSize: '0.85rem', color: TEXT2, marginBottom: 20 }}>
          Формируется из доходов, внесённых в текущем месяце
        </div>

        {totalBudget === 0 ? (
          <div style={{ background: '#fef9f5', borderRadius: 16, padding: 20, border: `1px solid ${BORDER}`, color: TEXT2, lineHeight: 1.7 }}>
            Пока доходов в текущем месяце не внесено.<br />
            <span style={{ color: ACCENT }}>Перейдите во вкладку «Текущий месяц» и добавьте доходы.</span>
          </div>
        ) : (
          <>
            {/* Итог */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ background: GREEN_LIGHT, borderRadius: 20, padding: '16px 24px', flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: '0.78rem', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Общий бюджет</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: GREEN }}>{ru(totalBudget)} ₽</div>
              </div>
              {vikaTotal > 0 && (
                <div style={{ background: '#fef9f5', borderRadius: 20, padding: '16px 24px', flex: 1, minWidth: 130, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🧑‍💻 Вика</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: TEXT }}>{ru(vikaTotal)} ₽</div>
                </div>
              )}
              {sergeyTotal > 0 && (
                <div style={{ background: '#fef9f5', borderRadius: 20, padding: '16px 24px', flex: 1, minWidth: 130, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: '0.78rem', color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎧 Серёжа</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: TEXT }}>{ru(sergeyTotal)} ₽</div>
                </div>
              )}
            </div>

            {/* Покрытие базы */}
            <div style={{ background: '#fef9f5', borderRadius: 18, padding: 16, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: TEXT }}>Покрытие базовых трат (158 000 ₽)</span>
                <span style={{ fontWeight: 700, color: surplus >= 0 ? GREEN : '#c0392b', fontSize: '1.1rem' }}>
                  {surplus >= 0 ? `✅ +${ru(surplus)} ₽ сверху` : `🆘 −${ru(Math.abs(surplus))} ₽ дефицит`}
                </span>
              </div>
              <div style={{ height: 12, background: '#f5e6dc', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min((totalBudget / TOTAL_FIXED) * 100, 100)}%`,
                  background: surplus < 0 ? '#c0392b' : `linear-gradient(90deg, ${ACCENT}, #f2a65a)`,
                  borderRadius: 8, transition: 'width 0.4s'
                }} />
              </div>
              <div style={{ marginTop: 8, fontSize: '0.82rem', color: TEXT2 }}>
                {ru(totalBudget)} ₽ из {ru(TOTAL_FIXED)} ₽ базы
              </div>
            </div>

            {/* Распределение по категориям */}
            {surplus > 0 && (
              <div>
                <div style={{ fontWeight: 700, color: TEXT, marginBottom: 10 }}>Распределение излишка ({ru(surplus)} ₽)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {CATEGORIES.filter(c => c.budget === 0).map(c => (
                    <div key={c.key} style={{ background: '#fef9f5', borderRadius: 16, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
                      <div>{c.emoji}</div>
                      <div style={{ fontSize: '0.85rem', color: TEXT2, marginTop: 2 }}>{c.name}</div>
                      <div style={{ fontSize: '0.82rem', color: TEXT2, marginTop: 4 }}>Всё сверх базы</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Источники */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: TEXT2, marginBottom: 10 }}>Источники</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {incomes.map(i => (
                  <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: GREEN_LIGHT, borderRadius: 12, padding: '8px 12px' }}>
                    <span>{i.who === 'Вика' ? '🧑‍💻' : '🎧'}</span>
                    <span style={{ flex: 1, fontSize: '0.9rem', color: TEXT }}>{i.who}{i.comment ? ` — ${i.comment}` : ''}</span>
                    <span style={{ fontWeight: 700, color: GREEN, whiteSpace: 'nowrap' }}>+{ru(i.amount)} ₽</span>
                    <span style={{ fontSize: '0.8rem', color: TEXT2 }}>{i.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── ПЛАНОВЫЕ КАТЕГОРИИ ── */}
      <div style={{ background: CARD_BG, borderRadius: 24, padding: 24, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginBottom: 16 }}>📊 Плановые категории</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {CATEGORIES.filter(c => c.budget > 0).map(c => (
            <div key={c.key} style={{ background: '#fef9f5', padding: '12px 14px', borderRadius: 16, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: '1.1rem' }}>{c.emoji}</div>
              <div style={{ fontSize: '0.82rem', color: TEXT2, marginTop: 2 }}>{c.name}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT, marginTop: 4 }}>{ru(c.budget)} ₽</div>
            </div>
          ))}
        </div>
      </div>

      {/* Заглушка для инпутов (пока нет редактирования) */}
      <div style={{ display: 'none' }}>
        <input style={inputStyle} /><select style={selectStyle} /><button style={btnPrimary} />
      </div>
    </div>
  );
}
