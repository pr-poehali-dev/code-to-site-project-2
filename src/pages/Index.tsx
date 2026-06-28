import { useState, CSSProperties } from 'react';
import CurrentMonth from './CurrentMonth';
import NextMonth from './NextMonth';
import History from './History';
import Savings from './Savings';
import PinLock, { PasswordSettings } from '../components/PinLock';

const s: Record<string, CSSProperties> = {
  body: {
    fontFamily: "'Nunito', sans-serif",
    background: 'linear-gradient(135deg, #fdf6f0 0%, #f9eae4 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#4a3b32',
    minHeight: '100vh',
  },
  header: {
    width: '100%',
    maxWidth: 1100,
    margin: '20px 20px 0 20px',
    padding: '28px 32px',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: 32,
    boxShadow: '0 12px 32px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02)',
    border: '1px solid rgba(255,255,255,0.9)',
  },
  headerTop: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 16, width: '100%',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  headerIcon: {
    fontSize: '3rem', background: '#fef0e7', width: 70, height: 70,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%', boxShadow: '0 6px 14px rgba(224,122,95,0.2)', color: '#e07a5f',
  },
  h1: { fontSize: '2rem', fontWeight: 700, color: '#5c4a3e', lineHeight: 1.2, margin: 0 },
  subtitle: { fontSize: '1rem', color: '#7b6b5e', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 },
  headerRight: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' },
  headerStat: {
    textAlign: 'center', background: '#fef9f5', borderRadius: 20,
    padding: '12px 18px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #f5e6dc',
  },
  statNumber: { fontSize: '1.5rem', fontWeight: 700, color: '#e07a5f', display: 'block' },
  statLabel: { fontSize: '0.8rem', color: '#7b6b5e', display: 'block' },
  headerTabs: {
    display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, paddingTop: 16,
    borderTop: '1px solid #f5e6dc', width: '100%', justifyContent: 'center',
  },
  tab: {
    padding: '8px 18px', borderRadius: 24, textDecoration: 'none', fontWeight: 600,
    fontSize: '0.9rem', color: '#5c4a3e', background: '#fef9f5',
    border: '1px solid #f5e6dc', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
    cursor: 'pointer',
  },
  tabActive: {
    background: '#e07a5f', color: 'white', borderColor: '#e07a5f',
    boxShadow: '0 4px 10px rgba(224,122,95,0.3)',
  },
  container: {
    maxWidth: 1100, width: '100%', display: 'flex', flexDirection: 'column', gap: 24, padding: 20,
  },
  card: {
    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderRadius: 28,
    padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, display: 'flex',
    alignItems: 'center', gap: 10, color: '#5c4a3e',
  },
  ruleList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  ruleItem: {
    padding: '12px 16px', background: '#fef9f5', borderRadius: 18,
    borderLeft: '4px solid #e07a5f', fontSize: '0.95rem', lineHeight: 1.5,
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
  },
  budgetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 },
  budgetItem: {
    background: '#fef9f5', padding: '14px 10px', borderRadius: 18,
    textAlign: 'center', border: '1px solid #f5e6dc',
  },
  budgetName: { fontSize: '0.85rem', color: '#7b6b5e', marginBottom: 4, display: 'block' },
  budgetAmount: { fontWeight: 700, fontSize: '1.15rem', color: '#4a3b32', display: 'block' },
  personalRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8, padding: '10px 0',
    borderTop: '1px dashed #e7d7cc', borderBottom: '1px dashed #e7d7cc',
    fontSize: '0.95rem', color: '#5c4a3e', flexWrap: 'wrap', gap: 8,
  },
  personalItem: { display: 'flex', alignItems: 'center', gap: 8 },
  personalPlus: { color: '#e07a5f', fontWeight: 700, fontSize: '1.2rem' },
  totalBudget: { marginTop: 12, fontWeight: 700, textAlign: 'right', fontSize: '1.2rem', color: '#5c4a3e' },
  chartContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 },
  pieChart: {
    width: 200, height: 200, borderRadius: '50%',
    background: `conic-gradient(
      #f4c9b0 0deg 68.4deg,
      #f2a65a 68.4deg 136.7deg,
      #f4d35e 136.7deg 193.7deg,
      #f9c6c9 193.7deg 262.1deg,
      #c1e1c1 262.1deg 273.4deg,
      #d4a5a5 273.4deg 284.8deg,
      #f4c9b0 284.8deg 330.3deg,
      #d4b8b0 330.3deg 348.5deg,
      #c1d5c1 348.5deg 355.3deg,
      #d4a5a5 355.3deg 360deg
    )`,
    position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  pieCenter: {
    position: 'absolute', width: 100, height: 100, background: '#fffaf6', borderRadius: '50%',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.4rem', color: '#4a3b32',
  },
  legend: { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
    background: '#fef9f5', padding: '5px 12px', borderRadius: 20, color: '#4a3b32',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  legendColor: { width: 12, height: 12, borderRadius: 4, flexShrink: 0 },
  scenarioButtons: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  scenarioBtn: {
    padding: '8px 18px', border: '1px solid #e7d7cc', background: '#fffaf6',
    borderRadius: 24, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
    fontSize: '0.9rem', color: '#5c4a3e',
  },
  scenarioBtnActive: {
    background: '#e07a5f', color: 'white', borderColor: '#e07a5f',
    boxShadow: '0 4px 10px rgba(224,122,95,0.3)',
  },
  scenarioDetails: {
    background: '#fef9f5', padding: 16, borderRadius: 18,
    display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between',
  },
  detail: { display: 'flex', flexDirection: 'column' },
  detailLabel: { fontSize: '0.8rem', color: '#7b6b5e', textTransform: 'uppercase', letterSpacing: '0.5px' },
  detailValue: { fontSize: '1.4rem', fontWeight: 700, color: '#4a3b32' },
  goalProgress: { marginTop: 16 },
  goalBar: { height: 22, background: '#f5e6dc', borderRadius: 12, overflow: 'hidden', margin: '8px 0' },
  goalFill: {
    height: '100%', background: 'linear-gradient(90deg, #e07a5f, #f2a65a)',
    borderRadius: 12, transition: 'width 0.4s ease',
  },
  seasons: { display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 },
  seasonCard: {
    background: '#fef9f5', padding: 16, borderRadius: 20, flex: '1 1 200px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #f5e6dc',
  },
  hr: { margin: '16px 0', border: 'none', borderTop: '1px solid #e7d7cc' },
  smallNote: { fontSize: '0.85rem', color: '#7b6b5e' },
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

const legendItems = [
  ['#f4c9b0', 'Аренда'], ['#f2a65a', 'Кредиты'], ['#f4d35e', 'Продукты'],
  ['#f9c6c9', 'Личные'], ['#c1e1c1', 'Животные'], ['#d4a5a5', 'Красота/здоровье'],
  ['#f4c9b0', 'Радости и развлечения'], ['#d4b8b0', 'Транспорт'],
  ['#c1d5c1', 'Связь'], ['#d4a5a5', 'Бытовая химия'],
];

const winterBtns = [
  ['opt', '🔥 Оптимистичный'], ['base', '✅ Базовый'], ['mid', '⚠️ Средний'],
  ['hard', '🆘 Тяжёлый'], ['extreme', '🚨 Экстремальный'],
];
const summerBtns = [
  ['summer_opt', '🔥 Оптимистичный'], ['summer_base', '✅ Базовый'], ['summer_mid', '⚠️ Средний'],
  ['summer_hard', '🆘 Тяжёлый'], ['summer_extreme', '🚨 Экстремальный'],
];

const tabs = [
  '🏠 Главная', '📅 Текущий месяц', '📆 Следующий месяц',
  '📜 История', '💰 Накопления', '⚙️ Настройки',
];

const PILLOW_TARGET = 500000;
const HOUSE_TARGET = 8500000;

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div style={s.detail}>
    <span style={s.detailLabel}>{label}</span>
    <span style={s.detailValue}>{value}</span>
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [winter, setWinter] = useState('opt');
  const [summer, setSummer] = useState('summer_opt');
  const pillowUntouchable = 0;
  const pillowSemi = 0;
  const house = 0;
  const reserve = 0;

  const w = winterScenarios[winter];
  const sv = summerScenarios[summer];

  const summerBaseDisplay = sv.deficit ? `−${ru(sv.deficit)} ₽` : 'Покрыта';
  const summerReserveDisplay =
    sv.mainReserve && sv.mainReserve > 0
      ? `+${ru(sv.mainReserve)} ₽`
      : sv.deficit && sv.deficit > 0
        ? `−${ru(sv.deficit)} ₽`
        : '0 ₽';

  return (
    <div style={s.body}>
      {/* Шапка */}
      <div style={s.header}>
        <div style={s.headerTop}>
          <div style={s.headerLeft}>
            <div style={s.headerIcon}>🏡</div>
            <div>
              <h1 style={s.h1}>Семейный бюджет</h1>
              <div style={s.subtitle}>
                <span>✨ Вика и Серёжа</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>уютная финансовая система</span>
              </div>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.headerStat}>
              <span style={s.statNumber}>158к</span>
              <span style={s.statLabel}>базовые траты</span>
            </div>
            <div style={s.headerStat}>
              <span style={s.statNumber}>1 млн</span>
              <span style={s.statLabel}>цель подушек</span>
            </div>
            <div style={s.headerStat}>
              <span style={s.statNumber}>8.5 млн</span>
              <span style={s.statLabel}>цель на дом</span>
            </div>
          </div>
        </div>
        <nav style={s.headerTabs}>
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{ ...s.tab, ...(activeTab === i ? s.tabActive : {}) }}
            >{t}</button>
          ))}
        </nav>
      </div>

      {/* Контент */}
      <div style={s.container}>

        {/* Вкладка: Текущий месяц */}
        {activeTab === 1 && <PinLock locked={true}><CurrentMonth /></PinLock>}

        {/* Остальные вкладки */}
        {activeTab === 2 && <PinLock locked={true}><NextMonth /></PinLock>}
        {activeTab === 3 && <PinLock locked={true}><History /></PinLock>}
        {activeTab === 4 && <PinLock locked={true}><Savings /></PinLock>}
        {activeTab === 5 && (
          <PinLock locked={true}>
            <div style={s.card}>
              <div style={s.sectionTitle}>⚙️ Настройки</div>
              <PasswordSettings />
            </div>
          </PinLock>
        )}

        {/* Главная (вкладка 0) */}
        {activeTab === 0 && <>

        {/* Правила */}
        <div style={s.card}>
          <div style={s.sectionTitle}>📜 Восемь железных правил</div>
          <ul style={s.ruleList}>
            {rules.map(([bold, rest], i) => (
              <li key={i} style={s.ruleItem}><strong>{bold}</strong>{rest}</li>
            ))}
          </ul>
        </div>

        {/* Бюджет + диаграмма */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div style={s.card}>
            <div style={s.sectionTitle}>📊 Базовые траты (158 000 ₽/мес)</div>
            <div style={s.budgetGrid}>
              {budget.map(([name, amount]) => (
                <div key={name} style={s.budgetItem}>
                  <span style={s.budgetName}>{name}</span>
                  <span style={s.budgetAmount}>{amount}</span>
                </div>
              ))}
            </div>
            <div style={s.personalRow}>
              <div style={s.personalItem}>
                <span style={s.personalPlus}>+</span>
                <span>Личные средства Серёжи — 15 000 ₽</span>
              </div>
              <div style={s.personalItem}>
                <span style={s.personalPlus}>+</span>
                <span>Личные средства Вики — 15 000 ₽</span>
              </div>
            </div>
            <div style={s.totalBudget}>Итого: 158 000 ₽</div>
          </div>
          <div style={{ ...s.card, ...s.chartContainer }}>
            <div style={s.pieChart}>
              <div style={s.pieCenter}>158к</div>
            </div>
            <div style={s.legend}>
              {legendItems.map(([color, name]) => (
                <div key={name} style={s.legendItem}>
                  <span style={{ ...s.legendColor, background: color }} />{name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Сезонное распределение */}
        <div style={s.card}>
          <div style={s.sectionTitle}>🔄 Сезонное распределение ответственности</div>
          <div style={s.seasons}>
            <div style={s.seasonCard}>
              <strong>Октябрь – Июнь</strong><br />
              <span>🧑‍💻 Вика: базовые траты (158 000) + остаток в основной резерв</span><br />
              <span>🎧 Серёжа: накопления на подушку/дом (по возможности 120 000) + остаток в основной резерв</span>
            </div>
            <div style={s.seasonCard}>
              <strong>Июль – Сентябрь</strong><br />
              <span>🎧 Серёжа: базовые траты (158 000) + остаток в основной резерв</span><br />
              <span>🧑‍💻 Вика: накопления на подушку/дом (по возможности 120 000) + остаток в основной резерв</span>
            </div>
          </div>
          <hr style={s.hr} />
          <div style={s.smallNote}>
            <strong>Основной резерв</strong> — средства на совместные траты, не попадающие ни под одну категорию: товары для дома и быта, электротехника, отпуск; непредвиденные расходы сверх лимита по категориям.<br />
            <strong>Подушка безопасности (1 млн)</strong>: 500 000 — неприкасаемый резерв на случай ЧП (болезнь, потеря дееспособности, смерть); 500 000 — полунеприкасаемый резерв для «пустых» месяцев (при пустом основном резерве).
          </div>
        </div>

        {/* Октябрь–Июнь */}
        <div style={s.card}>
          <div style={s.sectionTitle}>❄️ Период октябрь–июнь</div>
          <div style={s.scenarioButtons}>
            {winterBtns.map(([key, label]) => (
              <button
                key={key}
                style={{ ...s.scenarioBtn, ...(winter === key ? s.scenarioBtnActive : {}) }}
                onClick={() => setWinter(key)}
              >{label}</button>
            ))}
          </div>
          <div style={s.scenarioDetails}>
            <Detail label="ЗП Вики" value={`${ru(w.vika)} ₽`} />
            <Detail label="ЗП Серёжи" value={`${ru(w.sergey)} ₽`} />
            <Detail label="Общий доход" value={`${ru(w.total)} ₽`} />
            <Detail label="База (158 000)" value="Покрыта" />
            <Detail label="В накопления" value={`${ru(w.savings)} ₽`} />
            <Detail label="В Основной резерв" value={`${ru(w.mainReserve ?? 0)} ₽`} />
          </div>
          <div style={{ ...s.smallNote, marginTop: 12 }}>
            * При доходе Серёжи &lt; 120 000 ₽ весь его доход + остаток Вики (12 000) идут в накопления, основной резерв не пополняется.
          </div>
        </div>

        {/* Июль–Сентябрь */}
        <div style={s.card}>
          <div style={s.sectionTitle}>☀️ Период июль–сентябрь</div>
          <div style={s.scenarioButtons}>
            {summerBtns.map(([key, label]) => (
              <button
                key={key}
                style={{ ...s.scenarioBtn, ...(summer === key ? s.scenarioBtnActive : {}) }}
                onClick={() => setSummer(key)}
              >{label}</button>
            ))}
          </div>
          <div style={s.scenarioDetails}>
            <Detail label="ЗП Вики" value={`${ru(sv.vika)} ₽`} />
            <Detail label="ЗП Серёжи" value={`${ru(sv.sergey)} ₽`} />
            <Detail label="Общий доход" value={`${ru(sv.total)} ₽`} />
            <Detail label="База (158 000)" value={summerBaseDisplay} />
            <Detail label="В накопления" value={`${ru(sv.savings)} ₽`} />
            <Detail label="Основной резерв" value={summerReserveDisplay} />
          </div>
          <div style={{ ...s.smallNote, marginTop: 12 }}>
            * Сначала покрывается база (158 000), затем накопления (до 120 000), остаток → в Основной резерв. При дефиците разница берётся из Основного резерва.
          </div>
        </div>

        {/* Цели накоплений */}
        <div style={s.card}>
          <div style={s.sectionTitle}>🎯 Цели накоплений</div>
          <div style={s.goalProgress}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🛡️ Неприкасаемая подушка (ЧП)</span>
              <span>{ru(pillowUntouchable)} из 500 000 ₽</span>
            </div>
            <div style={s.goalBar}>
              <div style={{ ...s.goalFill, width: `${Math.min((pillowUntouchable / PILLOW_TARGET) * 100, 100)}%` }} />
            </div>
          </div>
          <div style={s.goalProgress}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🛡️ Полунеприкасаемая подушка (пустые месяцы)</span>
              <span>{ru(pillowSemi)} из 500 000 ₽</span>
            </div>
            <div style={s.goalBar}>
              <div style={{ ...s.goalFill, width: `${Math.min((pillowSemi / PILLOW_TARGET) * 100, 100)}%` }} />
            </div>
          </div>
          <div style={s.goalProgress}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🏠 Накопления на дом (цель 8 500 000 ₽)</span>
              <span>{ru(house)} из 8 500 000 ₽</span>
            </div>
            <div style={s.goalBar}>
              <div style={{ ...s.goalFill, width: `${Math.min((house / HOUSE_TARGET) * 100, 100)}%` }} />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
            <span>💰 Основной резерв: <strong>{ru(reserve)} ₽</strong></span>
          </div>
        </div>

        <div style={{ ...s.card, textAlign: 'center' }}>
          <p style={{ color: '#7b6b5e' }}>🏡 Всё учтено. Двигаемся по плану, без долгов и с уважением к общим целям.</p>
        </div>

        </>}
      </div>
    </div>
  );
};

export default Index;