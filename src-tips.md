# 開発に関する補足情報

## プロジェクト構造について

このPOCアプリケーションでは、ディレクトリ構造は以下のようになっています：

```
supabase-poc/
├── backend/              # バックエンドのルートディレクトリ
│   ├── prisma/           # Prismaの設定
│   ├── src/              # アプリケーションコード
│   │   ├── api/          # APIモジュール
│   │   ├── consumer/     # コンシューマーモジュール
│   │   ├── pubsub/       # PubSubモジュール
│   │   └── ...
│   └── ...
└── frontend/             # フロントエンドのルートディレクトリ
    ├── src/
    │   ├── api/          # APIクライアント
    │   └── pages/        # Nextのページコンポーネント
    └── ...
```

## 既知の問題と対処法

1. **TypeScriptのエラー**:
   - Chakra UIのコンポーネントに関する型エラーは、実行時には問題ありません
   - NestJSのデコレータに関するエラーも同様です

2. **依存関係のインストール**:
   - バックエンドでは `npm install` を実行してください
   - フロントエンドでも同様に依存関係をインストールしてください

## デバッグのヒント

1. バックエンドのログを確認するため、デバッグレベルを変更したい場合は、`main.ts`で`Logger`の設定を変更できます

2. データベース接続の問題が発生した場合は、Prisma Studioを使って確認できます:
   ```
   cd backend
   npm run prisma:studio
   ```

3. フロントエンドで型エラーが発生するが実行したい場合は、`next dev --no-typescript`を使用できます
