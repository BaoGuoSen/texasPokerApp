import type { User } from "texas-poker-core";

import { View, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';

import { useUser } from "@/contexts/UserContext";
import { useRef, useState } from "react";

export type IProps = {
  user?: User;
};

export function Login() {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleLogin = async () => {
    Keyboard.dismiss(); // 收起键盘
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert('请输入有效姓名');
      // Fix the type error by properly typing the ref
      (inputRef.current as unknown as TextInput)?.focus();
      return;
    }

    setIsLoading(true);
    try {
      await login(trimmedName);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="输入姓名"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        autoCorrect={false}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.button]}
        onPress={handleLogin}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>登 录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'transparent',
  },

  header: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },

  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
