import { useMemo, useState } from 'react'
import type { CardData, GameCard, GameState, ZoneName } from '../types'
import * as game from '../game'
import { CardImage } from './CardImage'
import { CardModal, type CardAction } from './CardModal'

interface Props {
  libraryCards: CardData[]
  onExit: () => void
}

interface Selected {
  gc: GameCard
  zone: ZoneName
}

/** ドロー&プレイのシミュレーター画面 */
export function Simulator({ libraryCards, onExit }: Props) {
  const [state, setState] = useState<GameState>(() => game.newGame(libraryCards))
  const [selected, setSelected] = useState<Selected | null>(null)
  const [showGraveyard, setShowGraveyard] = useState(false)

  const isMulligan = state.phase === 'mulligan'

  const handCurve = useMemo(
    () => [...state.hand].sort((a, b) => a.card.cmc - b.card.cmc),
    [state.hand],
  )

  const select = (gc: GameCard, zone: ZoneName) => setSelected({ gc, zone })

  const apply = (updater: (s: GameState) => GameState) => {
    setState(updater)
    setSelected(null)
    setShowGraveyard(false)
  }

  const actionsFor = ({ gc, zone }: Selected): CardAction[] => {
    switch (zone) {
      case 'hand':
        return [
          {
            label: game.isLand(gc.card) ? '土地を置く' : '場に出す',
            kind: 'primary',
            onClick: () => apply((s) => game.playCard(s, gc.id)),
          },
          {
            label: '墓地に置く',
            kind: 'danger',
            onClick: () => apply((s) => game.moveCard(s, gc.id, 'hand', 'graveyard')),
          },
        ]
      case 'battlefield':
      case 'lands':
        return [
          {
            label: gc.tapped ? 'アンタップ' : 'タップ',
            kind: 'primary',
            onClick: () => apply((s) => game.toggleTap(s, gc.id)),
          },
          {
            label: '手札に戻す',
            onClick: () => apply((s) => game.moveCard(s, gc.id, zone, 'hand')),
          },
          {
            label: '墓地に置く',
            kind: 'danger',
            onClick: () => apply((s) => game.moveCard(s, gc.id, zone, 'graveyard')),
          },
        ]
      case 'graveyard':
        return [
          {
            label: '手札に戻す',
            onClick: () => apply((s) => game.moveCard(s, gc.id, 'graveyard', 'hand')),
          },
        ]
      default:
        return []
    }
  }

  return (
    <div className="mtg-sim">
      {/* ステータスバー */}
      <div className="mtg-sim-status">
        <span className="stat">🃏 山札 {state.library.length}</span>
        <button
          type="button"
          className="stat as-button"
          onClick={() => setShowGraveyard(true)}
        >
          🪦 墓地 {state.graveyard.length}
        </button>
        <span className="stat">🕐 T{state.turn}</span>
        <span className="stat life">
          <button
            type="button"
            className="life-btn"
            onClick={() => setState((s) => game.changeLife(s, -1))}
          >
            −
          </button>
          ❤️ {state.life}
          <button
            type="button"
            className="life-btn"
            onClick={() => setState((s) => game.changeLife(s, +1))}
          >
            +
          </button>
        </span>
      </div>

      {/* 戦場 */}
      <div className="mtg-sim-board">
        <div className="mtg-zone">
          <span className="mtg-zone-label">戦場</span>
          <div className="mtg-zone-cards">
            {state.battlefield.length === 0 && (
              <span className="mtg-zone-empty">クリーチャー/呪文はここに出ます</span>
            )}
            {state.battlefield.map((gc) => (
              <CardImage
                key={gc.id}
                card={gc.card}
                tapped={gc.tapped}
                onClick={() => select(gc, 'battlefield')}
              />
            ))}
          </div>
        </div>
        <div className="mtg-zone">
          <span className="mtg-zone-label">土地 ({state.lands.length})</span>
          <div className="mtg-zone-cards lands">
            {state.lands.length === 0 && (
              <span className="mtg-zone-empty">土地はここに置かれます</span>
            )}
            {state.lands.map((gc) => (
              <CardImage
                key={gc.id}
                card={gc.card}
                tapped={gc.tapped}
                onClick={() => select(gc, 'lands')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 手札 */}
      <div className="mtg-sim-hand">
        <span className="mtg-zone-label">
          手札 ({state.hand.length})
          {isMulligan && state.mulligans > 0 && ` ・ マリガン${state.mulligans}回`}
        </span>
        <div className="mtg-hand-cards">
          {handCurve.map((gc) => (
            <CardImage
              key={gc.id}
              card={gc.card}
              onClick={() => (isMulligan ? select(gc, 'graveyard') : select(gc, 'hand'))}
            />
          ))}
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="mtg-bottom-bar">
        {isMulligan ? (
          <>
            <button type="button" className="mtg-btn ghost" onClick={onExit}>
              ← 戻る
            </button>
            <button
              type="button"
              className="mtg-btn"
              onClick={() => setState((s) => game.mulligan(s, libraryCards))}
            >
              マリガン ({Math.max(6 - state.mulligans, 0)}枚に)
            </button>
            <button
              type="button"
              className="mtg-btn primary"
              onClick={() => setState(game.keepHand)}
            >
              キープ
            </button>
          </>
        ) : (
          <>
            <button type="button" className="mtg-btn ghost" onClick={onExit}>
              ← 終了
            </button>
            <button
              type="button"
              className="mtg-btn"
              onClick={() => setState((s) => game.draw(s))}
              disabled={state.library.length === 0}
            >
              1枚引く
            </button>
            <button
              type="button"
              className="mtg-btn"
              onClick={() => setState(() => game.newGame(libraryCards))}
            >
              ↺ リセット
            </button>
            <button
              type="button"
              className="mtg-btn primary"
              onClick={() => setState(game.nextTurn)}
            >
              次のターン
            </button>
          </>
        )}
      </div>

      {/* カード操作モーダル */}
      {selected && (
        <CardModal
          card={selected.gc.card}
          actions={isMulligan ? [] : actionsFor(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {/* 墓地一覧モーダル */}
      {showGraveyard && (
        <div className="mtg-modal-backdrop" onClick={() => setShowGraveyard(false)}>
          <div className="mtg-modal wide" onClick={(e) => e.stopPropagation()}>
            <h3 className="mtg-modal-title">墓地 ({state.graveyard.length}枚)</h3>
            <div className="mtg-zone-cards wrap">
              {state.graveyard.length === 0 && (
                <span className="mtg-zone-empty">墓地は空です</span>
              )}
              {state.graveyard.map((gc) => (
                <CardImage key={gc.id} card={gc.card} onClick={() => select(gc, 'graveyard')} />
              ))}
            </div>
            <div className="mtg-modal-actions">
              <button
                type="button"
                className="mtg-btn ghost"
                onClick={() => setShowGraveyard(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="mtg-sim-hint">
        {isMulligan
          ? 'カードをタップで拡大表示。手札が決まったら「キープ」でターン1を開始。'
          : 'カードをタップして「場に出す」「タップ」などの操作を選べます。'}
      </p>
    </div>
  )
}
