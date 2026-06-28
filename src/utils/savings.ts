// ── Глобальное хранилище накоплений ──
// Структура: { pillow1, pillow2, house, reserve }
// pillow1 — неприкасаемая подушка (цель 500к)
// pillow2 — полунеприкасаемая подушка (цель 500к)
// house   — накопления на дом (цель 8 500 000)
// reserve — основной резерв (нет цели)

export const PILLOW_TARGET = 500_000;
export const HOUSE_TARGET  = 8_500_000;
export const SAVINGS_GOAL  = 120_000; // плановые накопления в месяц

export type SavingsState = {
  pillow1: number;
  pillow2: number;
  house:   number;
  reserve: number;
};

const SAVINGS_KEY = 'savings_global';

export function loadSavings(): SavingsState {
  try {
    const v = localStorage.getItem(SAVINGS_KEY);
    return v ? JSON.parse(v) : { pillow1: 0, pillow2: 0, house: 0, reserve: 0 };
  } catch {
    return { pillow1: 0, pillow2: 0, house: 0, reserve: 0 };
  }
}

export function saveSavings(state: SavingsState) {
  try { localStorage.setItem(SAVINGS_KEY, JSON.stringify(state)); } catch (_) { /* ignore */ }
}

export type Distribution = {
  pillow1: number;
  pillow2: number;
  house:   number;
  reserve: number;
};

/**
 * Рассчитывает как распределить сумму amount по целям,
 * исходя из текущего состояния накоплений.
 *
 * Логика:
 * - Первые 120к (SAVINGS_GOAL) делятся поровну между подушками,
 *   пока они не заполнены. Если обе заполнены — идут на дом.
 * - Всё свыше 120к → в основной резерв.
 */
export function distribute(amount: number, state: SavingsState): Distribution {
  const result: Distribution = { pillow1: 0, pillow2: 0, house: 0, reserve: 0 };
  if (amount <= 0) return result;

  // Делим: до 120к — «целевые», остаток — резерв
  const forGoals  = Math.min(amount, SAVINGS_GOAL);
  const forReserve = amount - forGoals;

  result.reserve += forReserve;

  // Распределяем forGoals
  let remaining = forGoals;

  const p1need = Math.max(0, PILLOW_TARGET - state.pillow1);
  const p2need = Math.max(0, PILLOW_TARGET - state.pillow2);
  const pillowsNeeded = p1need + p2need;

  if (pillowsNeeded > 0) {
    // Подушки не закрыты — делим поровну (но не превышаем нужду каждой)
    const half = remaining / 2;
    const toP1 = Math.min(half, p1need);
    const toP2 = Math.min(remaining - toP1, p2need);
    // Если одна уже закрыта — всё в другую
    const actualP1 = p1need === 0 ? 0 : Math.min(remaining - (p2need === 0 ? 0 : Math.min(half, p2need)), p1need);
    const actualP2 = p2need === 0 ? 0 : Math.min(remaining - actualP1, p2need);

    result.pillow1 = toP1;
    result.pillow2 = toP2;
    remaining -= toP1 + toP2;

    // Остаток (если обе подушки переполнились бы) — в дом
    if (remaining > 0) result.house += remaining;
  } else {
    // Обе подушки закрыты — всё в дом
    result.house += remaining;
  }

  return result;
}

export function applyDistribution(state: SavingsState, dist: Distribution): SavingsState {
  return {
    pillow1: state.pillow1 + dist.pillow1,
    pillow2: state.pillow2 + dist.pillow2,
    house:   state.house   + dist.house,
    reserve: state.reserve + dist.reserve,
  };
}
