import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from 'texas-poker-core/types/Player';
import { getUser } from '@/service';

// 定义 Context 类型
type UserContextType = {
  user: User | undefined;
	// logout: () => Promise<void>;
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

  // 初始化时加载用户数据
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = await getUser();

        setUser(userInfo);
      } catch (error) {
        console.error('加载用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};