import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert } from 'react-native';

interface ResBasic<T> {
  code: number
  msg: string
  data: T
}

const baseUrl = 'https://texas.wishufree.com/api/'

// 设置 Axios 请求拦截器
axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

async function betterRequest<R>(
  url: string,
  params?: Record<string, any>
) {
  try {
    const {
      data,
    } = await axios<ResBasic<R>>(baseUrl + url, {
      method: 'POST',
      data: params
    })

    if (data?.code !== 200) {
      throw new Error(data.msg)
    }

    return data;
  } catch (error) {
    const errMsg = (error as Error).message

    Alert.alert(
      '',
      errMsg
    );

    // 错误提示
    // 继续抛出错误, 为了终止之后的Promise处理进程
    throw new Error(errMsg)
  }
}

export default betterRequest