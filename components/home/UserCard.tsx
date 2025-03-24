import type { Room, CreateParams } from "@/types";

import { View, StyleSheet, TouchableHighlight, Text, Button } from 'react-native';
import { Image, ImageBackground } from 'expo-image';

import type { User } from "texas-poker-core/types/Player";

export type IProps = {
  user?: User;
};

export function UserCard({
  user
}: IProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={user?.avatar} />
      <Text style={styles.name}>{user?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'purple',
    padding: 4,
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
  }
});
