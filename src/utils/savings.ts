// ── Глобальное хранилище накоплений ──
// pillow1 — неприкасаемая подушка (цель 500к)
// pillow2 — полунеприкасаемая подушка (цель 500к)
// house   — накопления на дом (цель 8 500 000)
// reserve — основной резерв (без цели)

export const PILLOW_TARGET = 500_000;
export const HOUSE_TARGET  = 8_500_000;
export const SAVINGS_GOAL  = 120_000; // плановые накопления в месяц

export type SavingsState = {
  pillow1: number;
  pillow2: number;
  house:   number;
  reserve: number;
};

export type Distribution = {
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

/**
 * НАКОПЛЕНИЯ (кнопка «В заначку»):
 * - Первые 120к делятся поровну между подушками пока они не закрыты.
 *   Если одна закрыта — всё в другую. Если обе закрыты — всё в дом.
 * - Всё свыше 120к → в основной резерв.
 *
 * ОСТАТОК ОТ РАСХОДОВ (кнопка «Остаток в резерв»):
 * - Всегда идёт в основной резерв, вне зависимости от подушек.
 */
export function distribute(amount: number, state: SavingsState): Distribution {
  const result: Distribution = { pillow1: 0, pillow2: 0, house: 0, reserve: 0 };
  if (amount <= 0) return result;

  // Сверх 120к — всегда в резерв
  const forGoals   = Math.min(amount, SAVINGS_GOAL);
  result.reserve  += amount - forGoals;

  // Распределяем до 120к по подушкам / дому
  const p1need = Math.max(0, PILLOW_TARGET - state.pillow1);
  const p2need = Math.max(0, PILLOW_TARGET - state.pillow2);

  if (p1need === 0 && p2need === 0) {
    // Обе подушки закрыты — всё в дом
    result.house += forGoals;
  } else {
    // Делим поровну между незакрытыми подушками
    let left = forGoals;
    const toP1 = Math.min(left / 2, p1need);
    left -= toP1;
    const toP2 = Math.min(left, p2need);
    left -= toP2;
    // Если одна подушка переполнилась бы — остаток во вторую
    const extra1 = Math.min(forGoals / 2 - toP1, p2need - toP2);
    const finalP2 = toP2 + Math.max(0, extra1);
    const finalLeft = forGoals - toP1 - finalP2;

    result.pillow1 = toP1;
    result.pillow2 = finalP2;
    // Если что-то осталось после заполнения обеих — в дом
    result.house   = Math.max(0, finalLeft);
  }

  return result;
}

/** Остаток от расходов — всегда в резерв */
export function distributeRemainder(amount: number): Distribution {
  return { pillow1: 0, pillow2: 0, house: 0, reserve: Math.max(0, amount) };
}

export function applyDistribution(state: SavingsState, dist: Distribution): SavingsState {
  return {
    pillow1: state.pillow1 + dist.pillow1,
    pillow2: state.pillow2 + dist.pillow2,
    house:   state.house   + dist.house,
    reserve: state.reserve + dist.reserve,
  };
}

export function subtractFromSavings(state: SavingsState, dist: Distribution): SavingsState {
  return {
    pillow1: Math.max(0, state.pillow1 - dist.pillow1),
    pillow2: Math.max(0, state.pillow2 - dist.pillow2),
    house:   Math.max(0, state.house   - dist.house),
    reserve: Math.max(0, state.reserve - dist.reserve),
  };
}
