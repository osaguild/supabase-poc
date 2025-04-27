#!/bin/bash

# スクリプトの実行場所をプロジェクトルートに設定
cd "$(dirname "$0")"

echo "===== Supabase POC Docker 管理スクリプト ====="
echo ""

# 実行するコマンド
case "$1" in
  start)
    echo "コンテナを起動します..."
    docker-compose up -d
    echo ""
    echo "コンテナが起動しました。"
    echo ""
    echo "データベース接続情報:"
    echo "  Host:     localhost"
    echo "  Port:     5432"
    echo "  User:     postgres"
    echo "  Password: postgres"
    echo "  Database: supabase_poc"
    echo ""
    echo "Pub/Subエミュレーター情報:"
    echo "  Host:     localhost:8085"
    echo "  Project:  supabase-poc"
    echo ""
    echo "Prismaマイグレーションを実行するには:"
    echo "  cd backend && npx prisma migrate dev"
    ;;

  stop)
    echo "コンテナを停止します..."
    docker-compose stop
    ;;

  down)
    echo "コンテナを停止し、削除します..."
    docker-compose down
    ;;

  ps)
    echo "実行中のコンテナ:"
    docker-compose ps
    ;;
  
  logs)
    echo "コンテナのログを表示します..."
    docker-compose logs -f
    ;;

  *)
    echo "使用方法:"
    echo "  ./docker-start.sh start   # コンテナを起動"
    echo "  ./docker-start.sh stop    # コンテナを停止"
    echo "  ./docker-start.sh down    # コンテナを停止・削除"
    echo "  ./docker-start.sh ps      # コンテナの状態を確認"
    echo "  ./docker-start.sh logs    # コンテナのログを表示"
    exit 1
    ;;
esac

exit 0
