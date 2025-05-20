import React, {
  useState,
  ReactNode,
  useContext,
  useCallback,
  createContext
} from 'react';

import ErrorModal from '@/components/ErrorModal';

// 错误类型定义
type AppError = {
  title?: string;
  message: string;
  retry?: () => void;
};

type ErrorContextType = {
  showError: (error: AppError) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<AppError | null>(null);
  const [visible, setVisible] = useState(false);

  const showError = useCallback((error: AppError) => {
    setError(error);
    setVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setVisible(false);
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ErrorModal
        visible={visible}
        title={error?.title || '错误提示'}
        message={error?.message || '未知错误'}
        onClose={hideError}
        retry={error?.retry}
      />
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }

  console.log('111', context);
  return context;
};
