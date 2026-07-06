import { useEffect, useMemo, useState } from 'react'
import type { CardData, DeckDef } from './types'
import { DECKS } from './decks'
import { loadSetCards } from './scryfall'
import { buildLibrary } from './game'
import { DeckSelect } from './components/DeckSelect'
import { DeckView } from './components/DeckView'
import { Simulator } from './components/Simulator'
import './mtg.css'

type Screen = 'home' | 'deck' | 'play'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; cardMap: Map<string, CardData> }

export default function App() {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [screen, setScreen] = useState<Screen>('home')
  const [deck, setDeck] = useState<DeckDef | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    loadSetCards()
      .then((cardMap) => {
        if (!cancelled) setLoad({ status: 'ready', cardMap })
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : String(e)
          setLoad({ status: 'error', message })
        }
      })
    return () => {
      cancelled = true
    }
  }, [retryKey])

  const built = useMemo(() => {
    if (load.status !== 'ready' || !deck) return null
    return buildLibrary(deck, load.cardMap)
  }, [load, deck])

  const heading =
    screen === 'home' || !deck ? 'MTG Deck Simulator — M10' : deck.title

  return (
    <div className="mtg-app">
      <header className="mtg-header">
        <h1>{heading}</h1>
      </header>
      <main className="mtg-main">
        {load.status === 'loading' && (
          <div className="mtg-center">
            <div className="mtg-spinner" aria-hidden="true" />
            <p>Scryfallからカードデータを取得中…</p>
          </div>
        )}
        {load.status === 'error' && (
          <div className="mtg-center">
            <p className="mtg-warning">
              ⚠️ カードデータの取得に失敗しました。
              <br />
              {load.message}
            </p>
            <button
              type="button"
              className="mtg-btn primary"
              onClick={() => {
                setLoad({ status: 'loading' })
                setRetryKey((k) => k + 1)
              }}
            >
              再試行
            </button>
          </div>
        )}
        {load.status === 'ready' && screen === 'home' && (
          <DeckSelect
            decks={DECKS}
            onSelect={(d) => {
              setDeck(d)
              setScreen('deck')
            }}
          />
        )}
        {load.status === 'ready' && screen === 'deck' && deck && built && (
          <DeckView
            deck={deck}
            cardMap={load.cardMap}
            missing={built.missing}
            onStart={() => setScreen('play')}
            onBack={() => {
              setDeck(null)
              setScreen('home')
            }}
          />
        )}
        {load.status === 'ready' && screen === 'play' && deck && built && (
          <Simulator
            key={deck.id}
            libraryCards={built.cards}
            onExit={() => setScreen('deck')}
          />
        )}
      </main>
    </div>
  )
}
