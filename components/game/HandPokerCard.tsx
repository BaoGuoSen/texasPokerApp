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
  isShowHandsPokes: boolean;
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
  me = false,
  isShowHandsPokes = false
}: PokerCardProps) {
  const [type, val] = value.split('') as [Suit, Rank]

  return (
    <ImageBackground
      style={styles.container}
      contentFit='cover'
    >
      {
        ((me && val)) && (
          <ImageBackground>
            <Svg style={styles.value}>
              <G>
                {/* 显示数字 */}
                <Text
                  x={val === 't' ? '' : '22%'}
                  y={'80%'}
                  fontSize={25}
                  fill={suitColors[type]}
                  fontWeight="bold"
                >
                  {val?.toUpperCase() === 'T' ? '10' : val?.toUpperCase()}
                  {/* 10 */}
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
      {
        !me && isShowHandsPokes && (
          <ImageBackground>
            <Svg style={styles.value}>
              <G>
                {/* 显示数字 */}
                <Text
                  x={val === 't' ? '' : '22%'}
                  y={'80%'}
                  fontSize={25}
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
        !me && !isShowHandsPokes && (
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
    width: '46%',
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

  // topSuit: {
  //   display: 'flex',
  //   width: '100%',
  //   height: '25%',
  //   justifyContent: 'center',
  //   alignItems: 'flex-start',
  // },

  value: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '65%'
  },

  bottomSuit: {
    display: 'flex',
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});