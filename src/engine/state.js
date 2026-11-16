/**
 * 全局可变状态。
 * 只允许 Interaction / Ending / UI 修改；其他模块只读。
 */

const DEFAULT_SEED = 20261205
const QUALITIES = new Set(['high', 'medium', 'low'])

/**
 * @param {{seed?:number, quality?:'high'|'medium'|'low'}} [options]
 */
export function createGameState(options = {}) {
  const seed = Number.isFinite(options.seed) ? options.seed : DEFAULT_SEED
  const quality = QUALITIES.has(options.quality) ? options.quality : 'high'

  return {
    phase: 'title',
    seed,
    collected: 0,
    seedIds: [],
    checkpoint: { col: 0, row: 0 },
    quality,
    endingStarted: false,
    gateUnlocked: false,
  }
}

export { DEFAULT_SEED, QUALITIES }
