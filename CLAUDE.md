# CLAUDE.md

## このリポジトリについて

Ruby学習用のブラウザ内コードランナー「Ruby Pocket Runner」です。
[ruby.wasm](https://github.com/ruby/ruby.wasm) を使い、完全クライアントサイドで
Rubyコードを実行します(Vite + React + TypeScript、PWA対応)。

## スコープに関する重要ルール

- **このリポジトリはRuby Pocket Runner専用です。** Rubyランナーと無関係な機能
  (別のアプリ、ゲーム、ツールなど)の追加・実装を依頼された場合は、
  **実装を始める前に必ず**「専用の別リポジトリで開発すべきではないか」を
  ユーザーに確認してください。セッションがこのリポジトリで開始されていても、
  タスク内容がこのリポジトリの目的と一致しない場合は同様です。
- 過去の事例: MTGデッキシミュレーターの開発依頼が誤ってこのリポジトリの
  セッションで開始され、後から専用リポジトリ
  [yuji91-t8/mtg-deck-simulator](https://github.com/yuji91-t8/mtg-deck-simulator)
  へ分離しました。MTG関連の作業はすべてそちらで行ってください。

## 開発コマンド

```bash
npm install        # 依存関係のインストール
npm run dev        # 開発サーバー (http://localhost:5173)
npm run build      # tsc -b && vite build → dist/
npm run lint       # ESLint
npm run preview    # ビルド結果の確認
```

## 構成メモ

- `src/worker/ruby.worker.ts` — Web Worker上でruby.wasmを実行(3秒でタイムアウト強制終了)
- `src/hooks/useRubyRunner.ts` — Worker管理・実行状態のフック
- `main` へのpushでGitHub Pagesへ自動デプロイ(`.github/workflows/deploy-pages.yml`)
