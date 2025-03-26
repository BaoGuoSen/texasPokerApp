import type { Poke, Suit, Rank } from 'texas-poker-core/types/Deck/constant';

import { StyleSheet, View } from 'react-native';
import { ImageBackground } from 'expo-image';

import Svg, { Text, G } from 'react-native-svg';

import { ThemeConfig } from "@/constants/ThemeConfig";

import HandPokerSuits from './HandPokerSuits';

export type PokerCardProps = {
  value: Poke | string;
  hidden?: boolean;
  me: boolean;
};

// 定义花色颜色
const suitColors = {
  s: 'black',
  h: 'red',
  d: 'red',
  c: 'black',
};

export function HandPokerCard({
  value,
  me = false
}: PokerCardProps) {
  const [type, val] = value.split('') as [Suit, Rank]

  return (
    <ImageBackground
      source={!me ? ThemeConfig.pokerBackImg : ''}
      style={styles.container}
      contentFit='cover'
    >
      {
        me && val &&  (
          <ImageBackground>
            <View style={styles.topSuit}>
              <HandPokerSuits type={type} />
            </View>

            <Svg style={styles.value}>
              <G>
                {/* 显示数字 */}
                <Text
                  x={'20%'}
                  y={'90%'}
                  fontSize={20}
                  fill={suitColors[type]}
                  fontWeight="bold"
                >
                  {val?.toUpperCase() === 'T' ? '10' : val?.toUpperCase()}
                </Text>
              </G>
            </Svg>

            <View style={styles.bottomSuit}>
              <HandPokerSuits type={type} />
            </View>
          </ImageBackground>
        )
      }
      {
        me && !val && (
          <ImageBackground style={styles.meEmpty} source={ThemeConfig.pokerBackImg} />
        )
      }
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '25%',
    backgroundColor: '#fff',
    height: '100%',
    borderRadius: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderColor: ThemeConfig.pokerBackColor,
    borderWidth: 1
  },

  meEmpty: {
    width: '100%',
    backgroundColor: '#fff',
    height: '100%',
    borderRadius: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderColor: ThemeConfig.pokerBackColor,
    borderWidth: 1
  },

  topSuit: {
    display: 'flex',
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  bottomSuit: {
    display: 'flex',
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  value: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%'
  }
});