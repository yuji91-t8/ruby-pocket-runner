import { useState } from 'react'
import type { CardData } from '../types'

interface Props {
  card: CardData
  size?: 'small' | 'normal'
  tapped?: boolean
  onClick?: () => void
}

/**
 * Scryfall画像を表示するカード。画像が読み込めない場合は
 * カード名とマナコストのテキストプレースホルダーを表示する。
 */
export function CardImage({ card, size = 'small', tapped = false, onClick }: Props) {
  const [failed, setFailed] = useState(false)
  const src = size === 'small' ? card.imageSmall : card.imageNormal
  const classes = ['mtg-card', tapped ? 'tapped' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} aria-label={card.name}>
      {failed || !src ? (
        <span className="mtg-card-fallback">
          <span className="mtg-card-fallback-cost">{card.manaCost}</span>
          <span className="mtg-card-fallback-name">{card.name}</span>
          {card.power != null && (
            <span className="mtg-card-fallback-pt">
              {card.power}/{card.toughness}
            </span>
          )}
        </span>
      ) : (
        <img src={src} alt={card.name} loading="lazy" onError={() => setFailed(true)} />
      )}
    </button>
  )
}
