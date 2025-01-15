import { initializeApp, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebaseの設定
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase初期化関数
export const initializeFirebase = () => {
  try {
    // アプリが既に初期化されているかチェック
    const app = getApp();
    return { app };
  } catch (error) {
    // アプリの初期化
    const app = initializeApp(firebaseConfig);
    
    // iOS/Android両方で動作する認証の永続性設定
    const auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

    // Firestoreの初期化
    const db = getFirestore(app);
    
    // Storageの初期化
    const storage = getStorage(app);

    return { app, auth, db, storage };
  }
};

// Firebase各種サービスへのアクセス用のヘルパー関数
export const getFirebaseAuth = () => getAuth();
export const getFirebaseDb = () => getFirestore();
export const getFirebaseStorage = () => getStorage();

// プラットフォーム固有の設定を行う関数
export const configurePlatformSpecifics = () => {
  if (Platform.OS === 'ios') {
    // iOSの特殊な設定をここに記述
    // 例: キーチェーンの設定など
  } else if (Platform.OS === 'android') {
    // Androidの特殊な設定をここに記述
    // 例: バックグラウンドメッセージングの設定など
  }
};

// エラーハンドリング用のラッパー関数
export const handleFirebaseError = (error: any) => {
  console.error('Firebase Error:', error);
  
  // プラットフォーム固有のエラーハンドリング
  if (Platform.OS === 'ios') {
    // iOSのエラーハンドリング
    if (error.code === 'auth/invalid-api-key') {
      return 'iOSでのAPI認証エラーが発生しました';
    }
  } else if (Platform.OS === 'android') {
    // Androidのエラーハンドリング
    if (error.code === 'auth/network-request-failed') {
      return 'Androidでのネットワークエラーが発生しました';
    }
  }
  
  // 一般的なエラーメッセージ
  return 'エラーが発生しました。しばらく時間をおいて再度お試しください。';
};

// 使用例:
/*
import { initializeFirebase, getFirebaseAuth, handleFirebaseError } from './firebase-config';

// アプリの起動時
const initApp = async () => {
  try {
    const { app, auth, db, storage } = initializeFirebase();
    configurePlatformSpecifics();
    
    // これ以降、authやdb, storageを使用して操作可能
    const currentUser = getFirebaseAuth().currentUser;
    
  } catch (error) {
    const errorMessage = handleFirebaseError(error);
    // エラーメッセージの表示など
  }
};
*/