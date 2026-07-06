import type { CardData } from './types'

const SET_CODE = 'm10'
const CACHE_KEY = `mtg-cards-${SET_CODE}-v1`
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7日

interface ScryfallCard {
  name: string
  mana_cost?: string
  cmc?: number
  type_line?: string
  oracle_text?: string
  power?: string
  toughness?: string
  rarity?: string
  colors?: string[]
  image_uris?: { small?: string; normal?: string }
  scryfall_uri?: string
}

interface ScryfallList {
  data: ScryfallCard[]
  has_more: boolean
  next_page?: string
}

interface CacheShape {
  savedAt: number
  cards: CardData[]
}

function toCardData(c: ScryfallCard): CardData {
  return {
    name: c.name,
    manaCost: c.mana_cost ?? '',
    cmc: c.cmc ?? 0,
    typeLine: c.type_line ?? '',
    oracleText: c.oracle_text ?? '',
    power: c.power,
    toughness: c.toughness,
    rarity: c.rarity ?? '',
    colors: c.colors ?? [],
    imageNormal: c.image_uris?.normal ?? '',
    imageSmall: c.image_uris?.small ?? '',
    scryfallUri: c.scryfall_uri ?? '',
  }
}

function readCache(): CardData[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheShape
    if (!Array.isArray(parsed.cards) || parsed.cards.length === 0) return null
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null
    return parsed.cards
  } catch {
    return null
  }
}

function writeCache(cards: CardData[]) {
  try {
    const payload: CacheShape = { savedAt: Date.now(), cards }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // localStorageが使えない/容量超過の場合はキャッシュなしで動作する
  }
}

/**
 * M10セットの全カードをScryfall APIから取得する。
 * 結果はlocalStorageに7日間キャッシュされる。
 */
export async function loadSetCards(): Promise<Map<string, CardData>> {
  let cards = readCache()
  if (!cards) {
    cards = []
    // unique=prints で基本土地を含む全カードを取得(約250枚、2ページ)
    let url: string | undefined =
      'https://api.scryfall.com/cards/search?order=set&unique=prints&q=' +
      encodeURIComponent(`e:${SET_CODE}`)
    while (url) {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Scryfall APIエラー: HTTP ${res.status}`)
      }
      const page = (await res.json()) as ScryfallList
      cards.push(...page.data.map(toCardData))
      url = page.has_more ? page.next_page : undefined
    }
    writeCache(cards)
  }
  const map = new Map<string, CardData>()
  for (const c of cards) {
    const key = c.name.toLowerCase()
    // 基本土地は複数アートが収録されているため最初の1枚だけ採用する
    if (!map.has(key)) map.set(key, c)
  }
  return map
}
