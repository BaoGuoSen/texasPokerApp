import type { User } from 'texas-poker-core/types/Player';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUser, login as loginService } from '@/service';

// 定义 Context 类型
type UserContextType = {
  /** 用户信息 同时也用于是否登陆标识 */
  user: User | undefined;
  login: (name: string) => void;
	logout: () => Promise<void>;
  loading: boolean;
};

// 创建 Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 自定义 Hook 用于访问 Context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser 必须在 UserProvider 内使用');
  }

  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
      try {
        const userInfo = await getUser();

        setUser(userInfo);
      } catch (error) {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

  // 初始化时加载用户数据
  useEffect(() => {
    loadUser();
  }, []);

  const login = async (name: string) => {
    await loginService({ name });

    loadUser();
  }

  const logout = async () => {
    setUser(undefined);

    await AsyncStorage.clear();
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};