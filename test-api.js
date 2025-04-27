#!/usr/bin/env node

/**
 * API接続テストスクリプト
 * バックエンドAPIの疎通確認のためのシンプルなテスト
 * 
 * 使い方: node test-api.js
 */

// node:プロトコルに対応していない環境のために通常のrequireも用意
let http;
try {
  http = require('node:http');
} catch (error) {
  // node:プロトコルが利用できない場合は通常のhttpモジュールを使用
  http = require('http');
}

// 設定 - localhostではなく127.0.0.1を使用
const API_HOST = '127.0.0.1';
const API_PORT = 3003;
const API_PATH = '/api/entries';

console.log('=== API接続テストスクリプト ===');
console.log(`対象サーバー: http://${API_HOST}:${API_PORT}${API_PATH}`);

const options = {
  hostname: API_HOST,
  port: API_PORT,
  path: API_PATH,
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

// タイムアウト処理
const timeoutId = setTimeout(() => {
  console.error('リクエストがタイムアウトしました - サーバーが応答していません');
  process.exit(1);
}, 5000);

// ネットワーク接続テスト
console.log('接続テストを実施...');
const net = require('net');
const testConnection = () => {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(API_PORT, API_HOST);
    
    // タイムアウト設定
    socket.setTimeout(3000);
    
    socket.on('connect', () => {
      console.log(`✅ TCP接続テスト成功: ${API_HOST}:${API_PORT} に接続可能`);
      socket.end();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.error(`❌ 接続タイムアウト: ${API_HOST}:${API_PORT} に接続できませんでした`);
      socket.destroy();
      reject(new Error('接続タイムアウト'));
    });
    
    socket.on('error', (err) => {
      console.error(`❌ 接続エラー: ${err.message}`);
      socket.destroy();
      reject(err);
    });
  });
};

// まず接続テストを実行してから、APIリクエストを送信
testConnection()
  .then(() => {
    // リクエスト実行
    console.log('APIへリクエストを送信中...');
    const req = http.request(options, (res) => {
      console.log(`ステータスコード: ${res.statusCode}`);
      console.log(`レスポンスヘッダー: ${JSON.stringify(res.headers)}`);

      // レスポンスボディの収集
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        clearTimeout(timeoutId);
        
        try {
          const body = Buffer.concat(chunks).toString();
          console.log(`レスポンスボディ: ${body}`);
          
          if (res.statusCode === 200) {
            console.log('✅ APIテスト成功 - レスポンスを受信');
          } else {
            console.log(`❌ APIテスト失敗 - 不正なステータスコード: ${res.statusCode}`);
          }
        } catch (e) {
          console.error(`❌ レスポンスの解析中にエラーが発生: ${e.message}`);
        }
        
        process.exit(0);
      });
    });

    req.on('error', (error) => {
      clearTimeout(timeoutId);
      console.error(`❌ リクエストエラー: ${error.message}`);
      console.error('サーバーが実行されていることを確認し、ネットワーク接続をチェックしてください。');
      console.error(`CONNECTしようとした: ${API_HOST}:${API_PORT}`);
      process.exit(1);
    });

    req.end();
  })
  .catch(error => {
    clearTimeout(timeoutId);
    console.error(`バックエンドサーバーに接続できませんでした: ${error.message}`);
    process.exit(1);
  });
