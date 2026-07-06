import type { DeckDef } from './types'

/**
 * M10(基本セット2010)のカードのみで組んだリミテッド用40枚デッキ。
 * 各デッキ: 呪文23枚 + 基本土地17枚。
 * カード名はScryfall APIの英語名と完全一致させること。
 */
export const DECKS: DeckDef[] = [
  {
    id: 'white',
    title: '白単「セラの飛翔」',
    color: 'W',
    colorName: '白',
    description:
      '堅実なクリーチャーと飛行戦力で盤面を固める白単。平和な心で相手のエースを封じ、セラの天使とベインスレイヤーで空から決める。',
    basicLand: 'Plains',
    landCount: 17,
    spells: [
      { name: 'Soul Warden', count: 2 },
      { name: 'Silvercoat Lion', count: 2 },
      { name: 'Stormfront Pegasus', count: 2 },
      { name: 'Veteran Armorsmith', count: 2 },
      { name: 'Blinding Mage', count: 1 },
      { name: 'Veteran Swordsmith', count: 2 },
      { name: 'Griffin Sentinel', count: 2 },
      { name: 'Palace Guard', count: 1 },
      { name: 'Razorfoot Griffin', count: 2 },
      { name: 'Wall of Faith', count: 1 },
      { name: 'Serra Angel', count: 1 },
      { name: 'Baneslayer Angel', count: 1 },
      { name: 'Pacifism', count: 2 },
      { name: 'Excommunicate', count: 1 },
      { name: 'Divine Verdict', count: 1 },
    ],
  },
  {
    id: 'blue',
    title: '青単「霧の幻影」',
    color: 'U',
    colorName: '青',
    description:
      'ドローとバウンスでテンポを取りながら飛行クリーチャーで殴る青単。精神の制御で相手の切り札を奪い、睡眠で一気に勝負を決める。',
    basicLand: 'Island',
    landCount: 17,
    spells: [
      { name: 'Zephyr Sprite', count: 1 },
      { name: 'Coral Merfolk', count: 2 },
      { name: 'Merfolk Looter', count: 2 },
      { name: 'Horned Turtle', count: 2 },
      { name: 'Wind Drake', count: 2 },
      { name: 'Phantom Warrior', count: 1 },
      { name: 'Illusionary Servant', count: 1 },
      { name: 'Snapping Drake', count: 2 },
      { name: 'Air Elemental', count: 1 },
      { name: 'Djinn of Wishes', count: 1 },
      { name: 'Sphinx Ambassador', count: 1 },
      { name: 'Unsummon', count: 2 },
      { name: 'Essence Scatter', count: 1 },
      { name: 'Negate', count: 1 },
      { name: 'Divination', count: 1 },
      { name: 'Sleep', count: 1 },
      { name: 'Mind Control', count: 1 },
    ],
  },
  {
    id: 'black',
    title: '黒単「夜の血族」',
    color: 'B',
    colorName: '黒',
    description:
      '除去とハンデスで相手を消耗させる黒単。墓地から戦力を回収しつつ、夢魔と戦墓のグールでじわじわと盤面を支配する。',
    basicLand: 'Swamp',
    landCount: 17,
    spells: [
      { name: 'Child of Night', count: 2 },
      { name: 'Drudge Skeletons', count: 1 },
      { name: 'Warpath Ghoul', count: 2 },
      { name: 'Looming Shade', count: 1 },
      { name: 'Kelinore Bat', count: 2 },
      { name: 'Vampire Aristocrat', count: 1 },
      { name: 'Gravedigger', count: 2 },
      { name: 'Bog Wraith', count: 1 },
      { name: 'Howling Banshee', count: 1 },
      { name: 'Zombie Goliath', count: 1 },
      { name: 'Nightmare', count: 1 },
      { name: 'Doom Blade', count: 2 },
      { name: 'Sign in Blood', count: 2 },
      { name: 'Assassinate', count: 1 },
      { name: 'Mind Rot', count: 1 },
      { name: 'Tendrils of Corruption', count: 1 },
      { name: 'Rise from the Grave', count: 1 },
    ],
  },
  {
    id: 'red',
    title: '赤単「稲妻の猛攻」',
    color: 'R',
    colorName: '赤',
    description:
      '軽量クリーチャーと火力で速攻を仕掛ける赤単。稲妻で道をこじ開け、最後は火の玉かシヴ山のドラゴンでとどめを刺す。',
    basicLand: 'Mountain',
    landCount: 17,
    spells: [
      { name: 'Jackal Familiar', count: 2 },
      { name: 'Raging Goblin', count: 1 },
      { name: 'Goblin Piker', count: 2 },
      { name: 'Fiery Hellhound', count: 2 },
      { name: 'Viashino Spearhunter', count: 2 },
      { name: 'Goblin Artillery', count: 1 },
      { name: 'Canyon Minotaur', count: 2 },
      { name: 'Stone Giant', count: 1 },
      { name: 'Inferno Elemental', count: 1 },
      { name: 'Shivan Dragon', count: 1 },
      { name: 'Lightning Bolt', count: 2 },
      { name: 'Seismic Strike', count: 2 },
      { name: 'Act of Treason', count: 1 },
      { name: 'Trumpet Blast', count: 1 },
      { name: 'Lava Axe', count: 1 },
      { name: 'Fireball', count: 1 },
    ],
  },
  {
    id: 'green',
    title: '緑単「大地の咆哮」',
    color: 'G',
    colorName: '緑',
    description:
      'マナ加速から大型クリーチャーを叩きつける緑単。ラノワールのエルフで先行し、踏み荒らしで全軍突撃して勝負を決める。',
    basicLand: 'Forest',
    landCount: 17,
    spells: [
      { name: 'Llanowar Elves', count: 2 },
      { name: 'Elvish Visionary', count: 2 },
      { name: 'Runeclaw Bear', count: 2 },
      { name: 'Deadly Recluse', count: 1 },
      { name: 'Borderland Ranger', count: 2 },
      { name: 'Centaur Courser', count: 2 },
      { name: 'Awakener Druid', count: 1 },
      { name: 'Cudgel Troll', count: 1 },
      { name: 'Stampeding Rhino', count: 2 },
      { name: 'Craw Wurm', count: 1 },
      { name: 'Enormous Baloth', count: 1 },
      { name: 'Giant Growth', count: 2 },
      { name: 'Fog', count: 1 },
      { name: 'Rampant Growth', count: 1 },
      { name: 'Oakenform', count: 1 },
      { name: 'Overrun', count: 1 },
    ],
  },
]

export function deckSpellCount(deck: DeckDef): number {
  return deck.spells.reduce((sum, e) => sum + e.count, 0)
}

export function deckTotalCount(deck: DeckDef): number {
  return deckSpellCount(deck) + deck.landCount
}
