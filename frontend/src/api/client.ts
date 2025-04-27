import axios from 'axios';

// API通信を行うクライアント

interface NameData {
  firstName: string;
  lastName: string;
}

interface NameEntry {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface FullName {
  id: string;
  fullName: string;
  createdAt: string;
}

interface GetEntriesResponse {
  nameEntries: NameEntry[];
  fullNames: FullName[];
}

// デフォルトのAPIエンドポイントを設定（環境変数がない場合は明示的なURLを使用）
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3003';

// 開発中のデバッグ用に現在の設定を表示
console.log(`[CONFIG] API通信先: ${API_URL}`);
console.log(`[CONFIG] 環境変数NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || '(未設定)'}`);

// axios インスタンスを作成
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // リクエストタイムアウトを設定
  timeout: 10000,
  // CORSリクエストでクレデンシャルを送信しない（単純なリクエスト）
  withCredentials: false,
});

// リクエストインターセプターを追加
apiInstance.interceptors.request.use(
  config => {
    console.log(`[DEBUG] 送信するリクエスト: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error(`[DEBUG] リクエスト送信エラー: ${error.message}`);
    return Promise.reject(error);
  }
);

// レスポンスインターセプターを追加
apiInstance.interceptors.response.use(
  response => {
    console.log(`[DEBUG] 受信したレスポンス: Status=${response.status}`);
    return response;
  },
  error => {
    if (error.response) {
      // サーバーからのレスポンスがある場合
      console.error(`[DEBUG] サーバーエラー: Status=${error.response.status}, Data=${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない場合
      console.error(`[DEBUG] レスポンスなし: リクエスト=${JSON.stringify({
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      })}`);
    } else {
      // リクエスト設定中に何かしらのエラーが発生した場合
      console.error(`[DEBUG] 設定エラー: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  // 名前を送信する
  async createName(data: NameData): Promise<NameEntry> {
    try {
      console.log(`[DEBUG] API Request URL: ${apiInstance.defaults.baseURL}/api/names`);
      console.log(`[DEBUG] Request Headers: ${JSON.stringify(apiInstance.defaults.headers)}`);
      console.log(`[DEBUG] Request Data: ${JSON.stringify(data)}`);
      
      const response = await apiInstance.post('/api/names', data);
      console.log(`[DEBUG] Response Success: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error: any) {
      // エラー情報を詳細に出力
      console.error(`[ERROR] API call failed with status: ${error.response?.status || 'unknown'}`);
      console.error(`[ERROR] Error message: ${error.message}`);
      console.error(`[ERROR] Request URL: ${apiInstance.defaults.baseURL}/api/names`);
      console.error(`[ERROR] Request Data: ${JSON.stringify(data)}`);
      
      if (error.response) {
        // サーバーからのレスポンスがある場合
        console.error(`[ERROR] Response status: ${error.response.status}`);
        console.error(`[ERROR] Response headers: ${JSON.stringify(error.response.headers)}`);
        console.error(`[ERROR] Response data: ${JSON.stringify(error.response.data || {})}`);
      } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合
        console.error('[ERROR] No response received from server');
        console.error(`[ERROR] Request details: ${JSON.stringify(error.request)}`);
      }
      
      throw new Error(`Failed to create name: ${error.message}`);
    }
  },

  // 登録データを取得する
  async getEntries(): Promise<GetEntriesResponse> {
    try {
      console.log(`[DEBUG] API Request URL: ${apiInstance.defaults.baseURL}/api/entries`);
      console.log(`[DEBUG] Request Headers: ${JSON.stringify(apiInstance.defaults.headers)}`);
      
      const response = await apiInstance.get('/api/entries');
      console.log(`[DEBUG] Response Success: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error: any) {
      // エラー情報を詳細に出力
      console.error(`[ERROR] API call failed with status: ${error.response?.status || 'unknown'}`);
      console.error(`[ERROR] Error message: ${error.message}`);
      console.error(`[ERROR] Request URL: ${apiInstance.defaults.baseURL}/api/entries`);
      
      if (error.response) {
        // サーバーからのレスポンスがある場合
        console.error(`[ERROR] Response status: ${error.response.status}`);
        console.error(`[ERROR] Response headers: ${JSON.stringify(error.response.headers)}`);
        console.error(`[ERROR] Response data: ${JSON.stringify(error.response.data || {})}`);
      } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合
        console.error('[ERROR] No response received from server');
        console.error(`[ERROR] Request details: ${JSON.stringify(error.request, null, 2)}`);
      }
      
      throw new Error(`Failed to fetch entries: ${error.message}`);
    }
  },
};
