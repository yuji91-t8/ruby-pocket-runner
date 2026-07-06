import type { DeckDef } from '../types'
import { deckTotalCount } from '../decks'

const COLOR_ICONS: Record<string, string> = {
  W: '☀️',
  U: '💧',
  B: '💀',
  R: '🔥',
  G: '🌳',
}

interface Props {
  decks: DeckDef[]
  onSelect: (deck: DeckDef) => void
}

/** デッキ選択画面(ホーム) */
export function DeckSelect({ decks, onSelect }: Props) {
  return (
    <div className="mtg-deck-select">
      <p className="mtg-lead">
        M10(基本セット2010)限定の単色リミテッドデッキ(40枚)。
        デッキを選んでリストを確認し、ドローシミュレーションを始めましょう。
      </p>
      {decks.map((deck) => (
        <button
          key={deck.id}
          type="button"
          className={`mtg-deck-tile color-${deck.color}`}
          onClick={() => onSelect(deck)}
        >
          <span className="mtg-deck-icon">{COLOR_ICONS[deck.color]}</span>
          <span className="mtg-deck-info">
            <span className="mtg-deck-title">{deck.title}</span>
            <span className="mtg-deck-sub">
              {deck.colorName}単色 ・ {deckTotalCount(deck)}枚(土地{deck.landCount})
            </span>
          </span>
          <span className="mtg-deck-arrow">›</span>
        </button>
      ))}
      <p className="mtg-credit">
        カードデータ・画像は{' '}
        <a href="https://scryfall.com/" target="_blank" rel="noreferrer">
          Scryfall
        </a>{' '}
        から取得しています。
      </p>
    </div>
  )
}
