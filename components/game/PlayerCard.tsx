import type { Player } from '@/types'

import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Image, ImageBackground } from 'expo-image';

import  { HandPokerCard } from './HandPokerCard';

const PlaceholderAvator = require('@/assets/images/avator_1.png');
const PlaceholderBack = require('@/assets/images/background_1.png');

export function PlayerCard({
  balance = 0,
  name  = '人机',
  avatar = PlaceholderAvator,
  backgroudUrl = PlaceholderBack,
  handCards = ['', '']
}: Player) {
  return (
    <ImageBackground style={ styles.container } contentFit='cover' source={backgroudUrl}>
      <Image source={avatar} style={styles.avator} />

      <View style={ styles.content }>
        <View style={ styles.handPokerContainer }>
          {
            handCards.map((item, index) => {
              return <HandPokerCard key={index} value={item} />
            })
          }
        </View>

        <View style = { styles.info }>
          <Text style = { styles.price }>$ {balance}</Text>
          <Text style = { styles.name }>{name}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    maxHeight: '19%',
    paddingRight: 6,
    backgroundColor: '#fff'
  },

  avator: {
    width: 60,
    height: 60,
    borderRadius: 18,
  },

  content: {
    marginRight: 12,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6
  },

  handPokerContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    height: '80%',
    width: '100%',
    gap: 6,
    paddingBottom: 4
  },

  info: {
    display: 'flex',
    flexDirection: 'row-reverse',
    // alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    paddingLeft: 12
  },

  name: {
    color: 'yellow',
    fontWeight: 700,
  },

  price: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 14
  }
});
