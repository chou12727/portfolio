import axios from 'axios';
const isDev = import.meta.env.MODE === 'development';

const api = axios.create({
  baseURL: isDev ? 'http://localhost:4000/' : 'https://portfolio-fsos.onrender.com/',
  withCredentials: true
});

// api.interceptors.response.use(
//   response => response, // リクエスト成功時、データをそのまま返します
//   error => {
//     const { response } = error;
//     const status = response ? response.status : null;

//     // 401エラーの場合：ログインが必要です
//     if (status === 401) {
//     //   alert('ログインが必要です');
//       window.location.href = 'http://localhost:4000/login'; // 401エラー時、ログインページにリダイレクト
//     } 
//     // 500エラーの場合：サーバーエラー
//     else if (status === 500) {
//       alert('サーバーエラーが発生しました。');
//     } 
//     // 404エラーの場合：リソースが見つかりません
//     else if (status === 404) {
//       alert('リソースが見つかりません');
//     } 
//     // その他のエラーの場合：エラーが発生しました
//     else {
//       alert('エラーが発生しました');
//     }

//     return Promise.reject(error); // エラーを再度throwして、コンポーネント内のtry/catchで処理できるようにします
//   }
// );


export default api;
