# Supabase POCアプリケーション

このリポジトリは、Supabaseを活用したProof of Concept (POC) アプリケーションです。

## システム構成

- フロントエンド: Next.js + Chakra UI
- バックエンド: NestJS
- データベース: Supabase (PostgreSQL)
- メッセージキュー: GCP Pub/Sub

## 機能

1. 名前（性、名）をフォームから入力
2. バックエンドAPIでデータベースに保存し、Pub/Subにメッセージを発行
3. コンシューマーがPub/Subからメッセージを受信し、フルネーム（性+名）をデータベースに保存
4. フロントエンドで登録済みの名前とフルネームを表示

## 開発環境の準備

### 前提条件

- Node.js 18以上
- npm 7以上
- Supabase アカウントと接続情報
- GCP アカウントとPub/Sub設定

### 環境変数の設定

1. バックエンド (.env)
```
# Supabase
DATABASE_URL="postgresql://postgres:password@localhost:5432/supabase_poc"

# GCP
GCP_PROJECT_ID=your-project-id
GCP_PUBSUB_TOPIC=name-topic
GCP_PUBSUB_SUBSCRIPTION=name-subscription
GCP_CREDENTIALS_JSON={}

# Server
PORT=3003
```

2. フロントエンド (.env.local)
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:3003
```

### インストール手順

#### Dockerによる開発環境の準備

プロジェクトには開発環境用のDocker設定が含まれています：

```bash
# データベースとPub/Subエミュレーターを起動
./docker-start.sh start

# コンテナの状態確認
./docker-start.sh ps

# コンテナのログを確認
./docker-start.sh logs

# コンテナの停止
./docker-start.sh stop

# コンテナの削除（データは保持されます）
./docker-start.sh down
```

起動されるサービス：
1. PostgreSQL - データベース (`localhost:5432`)
2. GCP Pub/Sub Emulator - メッセージキュー (`localhost:8085`)

Pub/Subエミュレーターは本番環境のGCPを使用せずに、ローカルで開発できるようにするものです。
環境変数 `PUBSUB_EMULATOR_HOST=localhost:8085` が設定されていると、アプリケーションは自動的にエミュレーターを使用します。

#### バックエンドのセットアップ:
```bash
cd backend
npm install

# データベーススキーマの初期化（Dockerでデータベースを起動後に実行）
npx prisma migrate dev --name init
npx prisma generate
```

#### フロントエンドのセットアップ:
```bash
cd frontend
npm install
```

### 開発サーバーの起動

提供されている起動スクリプトを使うと、バックエンドとフロントエンドを一度に起動できます：

```bash
./start-dev.sh
```

または、個別に起動することもできます：

1. バックエンドの起動:
```bash
cd backend
npm run dev
```

2. フロントエンドの起動:
```bash
cd frontend
npm run dev
```

### 注意事項

- TypeScriptの型エラーがいくつか表示されますが、これらはChakra UIやNestJSのバージョンの互換性によるものです。実行には影響ありません。
- バックエンドを実行する前に、Supabaseの接続情報を`.env`ファイルに設定してください。
- VSCodeで開いているタブと実際のファイルパスが一致しない場合がありますが、開発には影響ありません。

フロントエンドは http://127.0.0.1:3002 でアクセスできます。  
バックエンドは http://127.0.0.1:3003 で動作します。

**重要**: localhost ではなく 127.0.0.1 を使用してアクセスしてください。

## API エンドポイント

- POST `/api/names` - 名前データを送信
- GET `/api/entries` - 登録済みの名前とフルネームを取得

## デプロイ

- フロントエンド: Vercel
- バックエンド: GCP Cloud Run
- インフラ管理: Terraform
