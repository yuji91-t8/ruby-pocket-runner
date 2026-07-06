import { useState } from 'react'
import type { CardData } from '../types'

export interface CardAction {
  label: string
  onClick: () => void
  kind?: 'primary' | 'danger'
}

interface Props {
  card: CardData
  actions?: CardAction[]
  onClose: () => void
}

/** カードの拡大表示モーダル。ゾーン操作ボタンを任意で表示する */
export function CardModal({ card, actions = [], onClose }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="mtg-modal-backdrop" onClick={onClose}>
      <div className="mtg-modal" onClick={(e) => e.stopPropagation()}>
        {failed || !card.imageNormal ? (
          <div className="mtg-modal-textcard">
            <h3>
              {card.name} <span className="cost">{card.manaCost}</span>
            </h3>
            <p className="type">{card.typeLine}</p>
            {card.oracleText && <p className="oracle">{card.oracleText}</p>}
            {card.power != null && (
              <p className="pt">
                {card.power}/{card.toughness}
              </p>
            )}
          </div>
        ) : (
          <img
            className="mtg-modal-img"
            src={card.imageNormal}
            alt={card.name}
            onError={() => setFailed(true)}
          />
        )}
        <div className="mtg-modal-actions">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className={`mtg-btn ${a.kind ?? ''}`}
              onClick={a.onClick}
            >
              {a.label}
            </button>
          ))}
          <button type="button" className="mtg-btn ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
