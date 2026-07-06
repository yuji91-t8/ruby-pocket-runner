import { useMemo, useState } from 'react'
import type { CardData, DeckDef } from '../types'
import { CardImage } from './CardImage'
import { CardModal } from './CardModal'

interface Props {
  deck: DeckDef
  cardMap: Map<string, CardData>
  missing: string[]
  onStart: () => void
  onBack: () => void
}

interface Row {
  card: CardData
  count: number
}

/** デッキリスト画面: カードをマナコスト順に一覧表示 */
export function DeckView({ deck, cardMap, missing, onStart, onBack }: Props) {
  const [preview, setPreview] = useState<CardData | null>(null)

  const rows = useMemo<Row[]>(() => {
    const list: Row[] = []
    for (const entry of deck.spells) {
      const card = cardMap.get(entry.name.toLowerCase())
      if (card) list.push({ card, count: entry.count })
    }
    list.sort((a, b) => a.card.cmc - b.card.cmc || a.card.name.localeCompare(b.card.name))
    const land = cardMap.get(deck.basicLand.toLowerCase())
    if (land) list.push({ card: land, count: deck.landCount })
    return list
  }, [deck, cardMap])

  return (
    <div className="mtg-deck-view">
      <p className="mtg-deck-desc">{deck.description}</p>
      {missing.length > 0 && (
        <p className="mtg-warning">
          ⚠️ 次のカードはM10のデータに見つかりませんでした: {missing.join(', ')}
        </p>
      )}
      <div className="mtg-deck-grid">
        {rows.map((row) => (
          <div key={row.card.name} className="mtg-deck-cell">
            <CardImage card={row.card} onClick={() => setPreview(row.card)} />
            <span className="mtg-deck-count">×{row.count}</span>
          </div>
        ))}
      </div>
      <div className="mtg-bottom-bar">
        <button type="button" className="mtg-btn ghost" onClick={onBack}>
          ← デッキ選択
        </button>
        <button type="button" className="mtg-btn primary" onClick={onStart}>
          ▶ シミュレート開始
        </button>
      </div>
      {preview && <CardModal card={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
