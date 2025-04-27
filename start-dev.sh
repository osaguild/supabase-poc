#!/bin/bash

# スクリプトの実行場所をプロジェクトルートに設定
cd "$(dirname "$0")"

echo "===== Supabase POC 開発環境起動スクリプト ====="
echo "このスクリプトは開発環境を起動します"

# バックエンドとフロントエンドを起動する関数
start_services() {
  echo ""
  echo ">> バックエンドを起動します..."
  cd backend
  npm run dev -- --preserveWatchOutput &
  BACKEND_PID=$!
  echo "バックエンド起動: PID $BACKEND_PID"
  
  cd ..
  echo ""
  echo ">> フロントエンドを起動します... ポート:3002"
  cd frontend
  # 環境変数を明示的に設定 - localhostではなく127.0.0.1を使用
  export NEXT_PUBLIC_API_URL=http://127.0.0.1:3003
  echo "環境変数 NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"
  npm run dev -- -p 3002 &
  FRONTEND_PID=$!
  echo "フロントエンド起動: PID $FRONTEND_PID"
  
  cd ..
  echo ""
  echo "開発環境が起動しました！"
  echo "バックエンド: http://127.0.0.1:3003"
  echo "フロントエンド: http://127.0.0.1:3002"
  echo ""
  echo "終了するには Ctrl+C を押してください"
  
  # シグナルハンドラを設定
  trap cleanup SIGINT SIGTERM
  
  # プロセスが終了するまで待機
  wait
}

# クリーンアップ関数
cleanup() {
  echo ""
  echo "開発環境を終了します..."
  
  # バックエンドプロセスの終了
  if [ -n "$BACKEND_PID" ]; then
    echo "バックエンドを停止しています (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
  fi
  
  # フロントエンドプロセスの終了
  if [ -n "$FRONTEND_PID" ]; then
    echo "フロントエンドを停止しています (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
  fi
  
  echo "開発環境を終了しました"
  exit 0
}

# メイン処理
echo ""
echo "バックエンドとフロントエンドを起動します"
start_services
