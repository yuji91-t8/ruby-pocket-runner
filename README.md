# Ruby Pocket Runner

ブラウザだけで動く、Ruby学習用のコードランナーです。サーバーには一切コードを送信せず、
[ruby.wasm](https://github.com/ruby/ruby.wasm) を使ってブラウザ内(Web Worker)でRubyコードを実行します。

## 主な機能

- CodeMirrorによるシンタックスハイライト付きRubyエディタ(タブは `Main.rb` の1つだけ)
- Runボタンでコードをブラウザ内実行、stdout / stderr をOutputパネルに表示
- 実行中・読み込み中などの状態表示
- コードのコピー機能、エディタへの貼り付け(OS標準のコピー&ペースト)に対応
- 無限ループ対策: コードはWeb Worker上で実行し、**3秒で強制終了(terminate)**
- スマホでも使えるレスポンシブUI
- ネットワーク上のサーバーで任意コードを実行する仕組みは持たない(完全クライアントサイド)

## 技術スタック

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- エディタ: [`@uiw/react-codemirror`](https://github.com/uiwjs/react-codemirror)([CodeMirror 6](https://codemirror.net/)) + `@codemirror/legacy-modes` (Rubyシンタックス)
- Ruby実行: [`@ruby/3.2-wasm-wasi`](https://www.npmjs.com/package/@ruby/3.2-wasm-wasi)(Ruby 3.2 + 標準ライブラリをWASI向けにビルドしたwasmバイナリ)

## セットアップ

### 必要環境

- Node.js 20以降推奨(開発はNode.js 22で確認)
- npm

### インストール

```bash
npm install
```

## 起動方法(開発)

```bash
npm run dev
```

コンソールに表示されるURL(デフォルトは http://localhost:5173 )をブラウザで開いてください。
初回アクセス時にRubyランタイム本体(wasmバイナリ、約30MB)をダウンロードするため、
ヘッダーの状態表示が「準備完了」になるまで少し待ってからRunボタンを押してください
(2回目以降はブラウザにキャッシュされるため高速になります)。

## ビルド

```bash
npm run build
```

`dist/` ディレクトリに静的ファイル一式が出力されます。生成物はHTML/CSS/JSとwasmバイナリのみで、
サーバーサイドの処理は含まれません。

ビルド結果をローカルで確認する場合:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## デプロイ方法

このアプリは完全に静的なファイルだけで動作するため、任意の静的ホスティングサービスにそのまま
デプロイできます。`vite.config.ts` の `base: './'` 設定により、サブパス配下(例:
`https://example.com/ruby-pocket-runner/`)にデプロイしても相対パスでアセットを解決できます。

### GitHub Pages の例

```bash
npm run build
# dist/ の内容を gh-pages ブランチ等に配置して公開
npx gh-pages -d dist
```

### Netlify / Vercel / Cloudflare Pages などの例

- Build command: `npm run build`
- Publish directory: `dist`

いずれの場合も、サーバー側でRubyコードを実行する設定は不要です(Build/Publishの設定のみで動作します)。

### 注意点

- wasmバイナリ(`ruby+stdlib.wasm`、約30MB)を配信するため、ホスティング先で `.wasm` の
  `Content-Type: application/wasm` が正しく返ること、またファイルサイズの制限に当たらないことを
  確認してください(主要な静的ホスティングサービスでは問題ありません)。
- Web Workerをモジュールとして読み込むため(`new Worker(url, { type: "module" })`)、
  古いブラウザ(モジュールワーカー非対応)では動作しません。

## 実行の仕組み・安全性について

- ユーザーが書いたRubyコードは、メインスレッドとは別の **Web Worker** の中で
  `@ruby/wasm-wasi` (ruby.wasm) を使って実行されます。
- 実行開始から **3秒経過しても完了しない場合、`Worker.terminate()` で強制終了**し、
  無限ループ等によってUIがフリーズすることを防ぎます。強制終了後は新しいWorkerを
  自動的に再生成し、次の実行に備えます。
- コードはネットワーク経由でどこにも送信されません。実行はすべてユーザーのブラウザ内で
  完結するため、外部サーバーで任意のRubyコードを実行するような仕組みはありません。
