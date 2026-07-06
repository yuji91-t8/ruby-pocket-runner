/** Scryfallから取得したカード情報のうち、アプリで使う項目だけを保持する */
export interface CardData {
  name: string
  manaCost: string
  cmc: number
  typeLine: string
  oracleText: string
  power?: string
  toughness?: string
  rarity: string
  colors: string[]
  /** 通常サイズのカード画像URL(Scryfall CDN) */
  imageNormal: string
  /** 小サイズのカード画像URL(Scryfall CDN) */
  imageSmall: string
  scryfallUri: string
}

export type ColorKey = 'W' | 'U' | 'B' | 'R' | 'G'

export interface DeckEntry {
  name: string
  count: number
}

export interface DeckDef {
  id: string
  /** デッキ名(日本語) */
  title: string
  color: ColorKey
  colorName: string
  description: string
  /** 基本土地の英語名 */
  basicLand: string
  landCount: number
  /** 呪文23枚ぶんのエントリー */
  spells: DeckEntry[]
}

/** 盤面上のカード1枚(同名カードを区別するためidを持つ) */
export interface GameCard {
  id: number
  card: CardData
  tapped: boolean
}

export type ZoneName = 'hand' | 'battlefield' | 'lands' | 'graveyard'

export interface GameState {
  /** ゲーム開始前(マリガン判断中)かどうか */
  phase: 'mulligan' | 'playing'
  turn: number
  life: number
  mulligans: number
  library: GameCard[]
  hand: GameCard[]
  battlefield: GameCard[]
  lands: GameCard[]
  graveyard: GameCard[]
}
