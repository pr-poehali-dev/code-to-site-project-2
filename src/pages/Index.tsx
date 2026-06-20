import { useState, CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  body: {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    background: '#f8fafc',
    padding: 20,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#1e293b',
  },
  container: {
    maxWidth: 1100,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  h1: { fontSize: '2rem', fontWeight: 600, textAlign: 'center', color: '#0f172a', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#475569', marginBottom: 8, fontSize: '1rem' },
  card: {
    background: 'white',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  ruleList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  ruleItem: { padding: '12px 16px', background: '#f1f5f9', borderRadius: 12, borderLeft: '4px solid #3b82f6', fontSize: '0.95rem', lineHeight: 1.4 },
  budgetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 },
  budgetItem: { background: '#f8fafc', padding: 12, borderRadius: 12, textAlign: 'center', border: '1px solid #e2e8f0' },
  budgetName: { fontSize: '0.85rem', color: '#475569', marginBottom: 4, display: 'block' },
  budgetAmount: { fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', display: 'block' },
  personalRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8, padding: '8px 0',
    borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1',
    fontSize: '0.95rem', flexWrap: 'wrap', gap: 8,
  },
  personalItem: { display: 'flex', alignItems: 'center', gap: 8 },
  personalPlus: { color: '#10b981', fontWeight: 700, fontSize: '1.2rem' },
  totalBudget: { marginTop: 12, fontWeight: 700, textAlign: 'right', fontSize: '1.2rem', color: '#0f172a' },
  chartContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 },
  pieChart: {
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: `conic-gradient(
      #3b82f6 0deg 68.4deg,
      #ef4444 68.4deg 136.7deg,
      #10b981 136.7deg 193.7deg,
      #f59e0b 193.7deg 262.1deg,
      #8b5cf6 262.1deg 273.4deg,
      #ec4899 273.4deg 284.8deg,
      #84cc16 284.8deg 330.3deg,
      #6366f1 330.3deg 348.5deg,
      #14b8a6 348.5deg 355.3deg,
      #a855f7 355.3deg 360deg
    )`,
    position: 'relative',
  },
  pieCenter: {
    position: 'absolute', width: 100, height: 100, background: 'white', borderRadius: '50%',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', color: '#0f172a',
  },
  legend: { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: 20 },
  legendColor: { width: 12, height: 12, borderRadius: 4, flexShrink: 0 },
  scenarioButtons: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  scenarioBtn: { padding: '8px 16px', border: '1px solid #cbd5e1', background: 'white', borderRadius: 20, cursor: 'pointer', fontWeight: 500, transition: '0.2s', fontSize: '0.9rem' },
  scenarioBtnActive: { background: '#0f172a', color: 'white', borderColor: '#0f172a' },
  scenarioDetails: { background: '#f8fafc', padding: 16, borderRadius: 16, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  detail: { display: 'flex', flexDirection: 'column' },
  detailLabel: { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  detailValue: { fontSize: '1.4rem', fontWeight: 700 },
  goalProgress: { marginTop: 16 },
  goalBar: { height: 20, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden', margin: '8px 0' },
  goalFill: { height: '100%', background: '#10b981', borderRadius: 10, transition: 'width 0.3s' },
  seasons: { display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 },
  seasonCard: { background: '#f1f5f9', padding: '12px 16px', borderRadius: 12, flex: '1 1 200px' },
  hr: { margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' },
  smallNote: { fontSize: '0.85rem', color: '#475569' },
};

type Scenario = {
  vika: number; sergey: number; total: number; base: number; savings: number; mainReserve?: number; deficit?: number;
};

const winterScenarios: Record<string, Scenario> = {
  opt: { vika: 170000, sergey: 150000, total: 320000, base: 158000, savings: 120000, mainReserve: 42000 },
  base: { vika: 170000, sergey: 120000, total: 290000, base: 158000, savings: 120000, mainReserve: 12000 },
  mid: { vika: 170000, sergey: 80000, total: 250000, base: 158000, savings: 92000, mainReserve: 0 },
  hard: { vika: 170000, sergey: 50000, total: 220000, base: 158000, savings: 62000, mainReserve: 0 },
  extreme: { vika: 170000, sergey: 30000, total: 200000, base: 158000, savings: 42000, mainReserve: 0 },
};

const summerScenarios: Record<string, Scenario> = {
  summer_opt: { vika: 120000, sergey: 250000, total: 370000, base: 158000, savings: 120000, mainReserve: 92000 },
  summer_base: { vika: 100000, sergey: 200000, total: 300000, base: 158000, savings: 120000, mainReserve: 22000 },
  summer_mid: { vika: 60000, sergey: 150000, total: 210000, base: 158000, savings: 52000, mainReserve: 0 },
  summer_hard: { vika: 30000, sergey: 100000, total: 130000, base: 158000, savings: 0, deficit: 28000 },
  summer_extreme: { vika: 0, sergey: 50000, total: 50000, base: 158000, savings: 0, deficit: 108000 },
};

const ru = (n: number) => n.toLocaleString('ru-RU');

const rules = [
  ['1. В текущем месяце мы тратим то, что заработали в предыдущем.', ' Деньги, заработанные в текущем месяце, идут на следующий.'],
  ['2. Не берем и не даем в долг.', ' Ни кредиток, ни травы в долг. Расчёт за работу – сразу.'],
  ['3. Категории не взаимозаменяемы.', ' Если «Радости и развлечения» на нуле – стаф и доставки ждут следующего месяца. Никаких перебросок.'],
  ['4. Остаток по категориям → в Основной резерв.', ' Всё, что не потрачено за месяц, уходит в основной резерв. Не добиваем до нуля специально.'],
  ['5. Изменение количества средств по категориям трат.', ' При необходимости по итогам прошедшего месяца мы можем перераспределить средства по категориям.'],
  ['6. Крупные покупки согласовываются.', ' Кроме трат из личных «пятнашек», всё обсуждаем вместе.'],
  ['7. Хотелки – только из личных средств (по 15 000 ₽/чел).', ' В случае нехватки личных и крайней необходимости по согласованию можно взять из основного резерва. Личные накопления - из личных. Подарки друг другу - из личных, подарки другим - вскладчину из личных (или по договоренности).'],
  ['8. Подушки безопасности и основной резерв.', ' Нам необходимо накопить и поддерживать 2 подушки безопасности: 500 000 — неприкасаемый резерв на случай ЧП (потеря работоспособности, болезнь, смерть); 500 000 — полунеприкасаемый резерв для месяцев с критически низким общим доходом (при пустом основном резерве). Параллельно из остатка средств копится основной резерв, который будет использован для совместных трат и непредвиденных расходов сверх лимитов.'],
];

const budget = [
  ['Аренда', '30 000'], ['Кредиты', '30 000'], ['Продукты', '25 000'],
  ['Радости и развлечения', '20 000'], ['Транспорт', '8 000'], ['Животные', '5 000'],
  ['Красота/здоровье', '5 000'], ['Связь', '3 500'], ['Бытовая химия', '1 500'],
];

const legend = [
  ['#3b82f6', 'Аренда'], ['#ef4444', 'Кредиты'], ['#10b981', 'Продукты'],
  ['#f59e0b', 'Личные'], ['#8b5cf6', 'Животные'], ['#ec4899', 'Красота/здоровье'],
  ['#84cc16', 'Радости и развлечения'], ['#6366f1', 'Транспорт'],
  ['#14b8a6', 'Связь'], ['#a855f7', 'Бытовая химия'],
];

const winterBtns = [
  ['opt', '🔥 Оптимистичный'], ['base', '✅ Базовый'], ['mid', '⚠️ Средний'],
  ['hard', '🆘 Тяжёлый'], ['extreme', '🚨 Экстремальный'],
];
const summerBtns = [
  ['summer_opt', '🔥 Оптимистичный'], ['summer_base', '✅ Базовый'], ['summer_mid', '⚠️ Средний'],
  ['summer_hard', '🆘 Тяжёлый'], ['summer_extreme', '🚨 Экстремальный'],
];

const PILLOW_TARGET = 500000;
const HOUSE_TARGET = 8500000;

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div style={styles.detail}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value}</span>
  </div>
);

const Index = () => {
  const [winter, setWinter] = useState('opt');
  const [summer, setSummer] = useState('summer_opt');
  const [pillowUntouchable, setPillowUntouchable] = useState(0);
  const [pillowSemi, setPillowSemi] = useState(0);
  const [house, setHouse] = useState(0);
  const [reserve, setReserve] = useState(0);

  const w = winterScenarios[winter];
  const s = summerScenarios[summer];

  const summerBaseDisplay = s.deficit ? `−${ru(s.deficit)} ₽` : 'Покрыта';
  const summerReserveDisplay =
    s.mainReserve && s.mainReserve > 0
      ? `+${ru(s.mainReserve)} ₽`
      : s.deficit && s.deficit > 0
        ? `−${ru(s.deficit)} ₽`
        : '0 ₽';

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>🏡 Семейный бюджет</h1>
        <div style={styles.subtitle}>Вика и Серёжа - финансовая система на доверии и правилах</div>

        {/* Правила */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>📜 Восемь железных правил</div>
          <ul style={styles.ruleList}>
            {rules.map(([bold, rest], i) => (
              <li key={i} style={styles.ruleItem}><strong>{bold}</strong>{rest}</li>
            ))}
          </ul>
        </div>

        {/* Бюджет + диаграмма */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>📊 Базовые траты (158 000 ₽/мес)</div>
            <div style={styles.budgetGrid}>
              {budget.map(([name, amount]) => (
                <div key={name} style={styles.budgetItem}>
                  <span style={styles.budgetName}>{name}</span>
                  <span style={styles.budgetAmount}>{amount}</span>
                </div>
              ))}
            </div>
            <div style={styles.personalRow}>
              <div style={styles.personalItem}>
                <span style={styles.personalPlus}>+</span>
                <span>Личные средства Серёжи — 15 000 ₽</span>
              </div>
              <div style={styles.personalItem}>
                <span style={styles.personalPlus}>+</span>
                <span>Личные средства Вики — 15 000 ₽</span>
              </div>
            </div>
            <div style={styles.totalBudget}>Итого: 158 000 ₽</div>
          </div>
          <div style={{ ...styles.card, ...styles.chartContainer }}>
            <div style={styles.pieChart}>
              <div style={styles.pieCenter}>158к</div>
            </div>
            <div style={styles.legend}>
              {legend.map(([color, name]) => (
                <div key={name} style={styles.legendItem}>
                  <span style={{ ...styles.legendColor, background: color }} />{name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Сезонное распределение */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>🔄 Сезонное распределение ответственности</div>
          <div style={styles.seasons}>
            <div style={styles.seasonCard}>
              <strong>Октябрь – Июнь</strong><br />
              <span>🧑‍💻 Вика: базовые траты (158 000) + остаток в основной резерв</span><br />
              <span>🎧 Серёжа: накопления на подушку/дом (по возможности 120 000) + остаток в основной резерв</span>
            </div>
            <div style={styles.seasonCard}>
              <strong>Июль – Сентябрь</strong><br />
              <span>🎧 Серёжа: базовые траты (158 000) + остаток в основной резерв</span><br />
              <span>🧑‍💻 Вика: накопления на подушку/дом (по возможности 120 000) + остаток в основной резерв</span>
            </div>
          </div>
          <hr style={styles.hr} />
          <div style={styles.smallNote}>
            <strong>Основной резерв</strong> — средства на совместные траты, не попадающие ни под одну категорию: товары для дома и быта, электротехника, отпуск; непредвиденные расходы сверх лимита по категориям.<br />
            <strong>Подушка безопасности (1 млн)</strong>: 500 000 — неприкасаемый резерв на случай ЧП (болезнь, потеря дееспособности, смерть); 500 000 — полунеприкасаемый резерв для «пустых» месяцев (при пустом основном резерве).
          </div>
        </div>

        {/* Октябрь–Июнь */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>❄️ Период октябрь–июнь</div>
          <div style={styles.scenarioButtons}>
            {winterBtns.map(([key, label]) => (
              <button
                key={key}
                style={{ ...styles.scenarioBtn, ...(winter === key ? styles.scenarioBtnActive : {}) }}
                onClick={() => setWinter(key)}
              >{label}</button>
            ))}
          </div>
          <div style={styles.scenarioDetails}>
            <Detail label="ЗП Вики" value={`${ru(w.vika)} ₽`} />
            <Detail label="ЗП Серёжи" value={`${ru(w.sergey)} ₽`} />
            <Detail label="Общий доход" value={`${ru(w.total)} ₽`} />
            <Detail label="База (158 000)" value="Покрыта" />
            <Detail label="В накопления" value={`${ru(w.savings)} ₽`} />
            <Detail label="В Основной резерв" value={`${ru(w.mainReserve ?? 0)} ₽`} />
          </div>
          <div style={{ ...styles.smallNote, marginTop: 12 }}>
            * При доходе Серёжи &lt; 120 000 ₽ весь его доход + остаток Вики (12 000) идут в накопления, основной резерв не пополняется.
          </div>
        </div>

        {/* Июль–Сентябрь */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>☀️ Период июль–сентябрь</div>
          <div style={styles.scenarioButtons}>
            {summerBtns.map(([key, label]) => (
              <button
                key={key}
                style={{ ...styles.scenarioBtn, ...(summer === key ? styles.scenarioBtnActive : {}) }}
                onClick={() => setSummer(key)}
              >{label}</button>
            ))}
          </div>
          <div style={styles.scenarioDetails}>
            <Detail label="ЗП Вики" value={`${ru(s.vika)} ₽`} />
            <Detail label="ЗП Серёжи" value={`${ru(s.sergey)} ₽`} />
            <Detail label="Общий доход" value={`${ru(s.total)} ₽`} />
            <Detail label="База (158 000)" value={summerBaseDisplay} />
            <Detail label="В накопления" value={`${ru(s.savings)} ₽`} />
            <Detail label="Основной резерв" value={summerReserveDisplay} />
          </div>
          <div style={{ ...styles.smallNote, marginTop: 12 }}>
            * Сначала покрывается база (158 000), затем накопления (до 120 000), остаток → в Основной резерв. При дефиците разница берётся из Основного резерва.
          </div>
        </div>

        {/* Цели накоплений */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>🎯 Цели накоплений</div>
          <div style={styles.goalProgress}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🛡️ Неприкасаемая подушка (ЧП)</span>
              <span>{ru(pillowUntouchable)} из 500 000 ₽</span>
            </div>
            <div style={styles.goalBar}>
              <div style={{ ...styles.goalFill, width: `${Math.min((pillowUntouchable / PILLOW_TARGET) * 100, 100)}%` }} />
            </div>
          </div>
          <div style={styles.goalProgress}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🛡️ Полунеприкасаемая подушка (пустые месяцы)</span>
              <span>{ru(pillowSemi)} из 500 000 ₽</span>
            </div>
            <div style={styles.goalBar}>
              <div style={{ ...styles.goalFill, width: `${Math.min((pillowSemi / PILLOW_TARGET) * 100, 100)}%` }} />
            </div>
          </div>
          <div style={styles.goalProgress}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🏠 Накопления на дом (цель 8 500 000 ₽)</span>
              <span>{ru(house)} из 8 500 000 ₽</span>
            </div>
            <div style={styles.goalBar}>
              <div style={{ ...styles.goalFill, width: `${Math.min((house / HOUSE_TARGET) * 100, 100)}%` }} />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>💰 Основной резерв: <strong>{ru(reserve)} ₽</strong></span>
          </div>
          {/* Скрытые сеттеры — используются только для типизации, UI без кнопки симуляции как в оригинале */}
          <div style={{ display: 'none' }}>
            {[setPillowUntouchable, setPillowSemi, setHouse, setReserve].map((_, i) => <span key={i} />)}
          </div>
        </div>

        <div style={{ ...styles.card, textAlign: 'center' }}>
          <p style={{ color: '#475569' }}>Всё учтено. Двигаемся по плану, без долгов и с уважением к общим целям.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;