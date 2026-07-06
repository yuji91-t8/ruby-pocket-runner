import type { CardData, DeckDef, GameCard, GameState, ZoneName } from './types'

let nextId = 1

function makeGameCard(card: CardData): GameCard {
  return { id: nextId++, card, tapped: false }
}

/** Fisher-Yatesシャッフル(非破壊) */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function isLand(card: CardData): boolean {
  return card.typeLine.includes('Land')
}

/**
 * デッキ定義とカードデータからライブラリー(40枚)を構築する。
 * カードデータに見つからなかった名前は missing に返す。
 */
export function buildLibrary(
  deck: DeckDef,
  cardMap: Map<string, CardData>,
): { cards: CardData[]; missing: string[] } {
  const cards: CardData[] = []
  const missing: string[] = []
  for (const entry of deck.spells) {
    const card = cardMap.get(entry.name.toLowerCase())
    if (!card) {
      missing.push(entry.name)
      continue
    }
    for (let i = 0; i < entry.count; i++) cards.push(card)
  }
  const land = cardMap.get(deck.basicLand.toLowerCase())
  if (land) {
    for (let i = 0; i < deck.landCount; i++) cards.push(land)
  } else {
    missing.push(deck.basicLand)
  }
  return { cards, missing }
}

/** ゲーム開始: シャッフルして7枚引き、マリガン判断フェイズに入る */
export function newGame(libraryCards: CardData[]): GameState {
  const library = shuffle(libraryCards.map(makeGameCard))
  const hand = library.splice(0, 7)
  return {
    phase: 'mulligan',
    turn: 0,
    life: 20,
    mulligans: 0,
    library,
    hand,
    battlefield: [],
    lands: [],
    graveyard: [],
  }
}

/** マリガン: 引き直して1枚少ない初手にする */
export function mulligan(state: GameState, libraryCards: CardData[]): GameState {
  const mulligans = Math.min(state.mulligans + 1, 7)
  const library = shuffle(libraryCards.map(makeGameCard))
  const hand = library.splice(0, Math.max(7 - mulligans, 0))
  return {
    ...state,
    mulligans,
    library,
    hand,
    battlefield: [],
    lands: [],
    graveyard: [],
  }
}

/** キープしてターン1を開始する */
export function keepHand(state: GameState): GameState {
  return { ...state, phase: 'playing', turn: 1 }
}

/** 1枚ドロー。ライブラリーが空なら何もしない */
export function draw(state: GameState, count = 1): GameState {
  const library = [...state.library]
  const drawn = library.splice(0, Math.min(count, library.length))
  return { ...state, library, hand: [...state.hand, ...drawn] }
}

/** 次のターンへ: 全てアンタップして1枚ドロー */
export function nextTurn(state: GameState): GameState {
  const untap = (cards: GameCard[]) => cards.map((c) => ({ ...c, tapped: false }))
  const untapped: GameState = {
    ...state,
    turn: state.turn + 1,
    battlefield: untap(state.battlefield),
    lands: untap(state.lands),
  }
  return draw(untapped)
}

function removeFrom(zone: GameCard[], id: number): { zone: GameCard[]; card?: GameCard } {
  const idx = zone.findIndex((c) => c.id === id)
  if (idx < 0) return { zone }
  const copy = [...zone]
  const [card] = copy.splice(idx, 1)
  return { zone: copy, card }
}

/** カードをゾーン間で移動する。移動時はアンタップ状態に戻す */
export function moveCard(
  state: GameState,
  id: number,
  from: ZoneName,
  to: ZoneName,
): GameState {
  const { zone: fromZone, card } = removeFrom(state[from], id)
  if (!card) return state
  const moved = { ...card, tapped: false }
  return { ...state, [from]: fromZone, [to]: [...state[to], moved] }
}

/** 手札から場に出す。土地は土地エリアへ */
export function playCard(state: GameState, id: number): GameState {
  const target = state.hand.find((c) => c.id === id)
  if (!target) return state
  const to: ZoneName = isLand(target.card) ? 'lands' : 'battlefield'
  return moveCard(state, id, 'hand', to)
}

/** 戦場のカードのタップ/アンタップを切り替える */
export function toggleTap(state: GameState, id: number): GameState {
  const flip = (cards: GameCard[]) =>
    cards.map((c) => (c.id === id ? { ...c, tapped: !c.tapped } : c))
  return { ...state, battlefield: flip(state.battlefield), lands: flip(state.lands) }
}

export function changeLife(state: GameState, delta: number): GameState {
  return { ...state, life: state.life + delta }
}
