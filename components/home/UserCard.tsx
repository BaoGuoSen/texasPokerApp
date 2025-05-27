import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { themeConfig } from '@/constants/ThemeConfig';
import { useUser } from '@/contexts/UserContext';

export function UserCard() {
  const { user, logout } = useUser();

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={user?.avatar || themeConfig.defaultAvatar}
      />
      <Text style={styles.name}>{user?.name}</Text>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text>退出</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4
  },

  avatar: {
    width: '80%',
    height: '80%',
    display: 'flex',
    borderRadius: 16
  },

  name: {
    fontFamily: 'SpaceMono',
    fontSize: 22,
    fontWeight: 600,
    color: '#fff'
  },

  logout: {
    width: '100%',
    height: '12%',
    backgroundColor: '#999',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  }
});
