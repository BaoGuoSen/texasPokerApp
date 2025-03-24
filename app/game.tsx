import type { Poke } from 'texas-poker-core/types/Deck/constant';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { useEffect, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';

import { PlayerCard } from '@/components/game/PlayerCard';
import { PokerCard } from '@/components/game/PokerCard';
import { usePlayers } from '@/hooks/usePlayers';
import { splitArray } from '@/utils';
import { Player } from '@/types';
import { useMyUser } from '@/hooks/useMyUser';

const background = require('@/assets/images/Cosmic-eidex-eidex_black.svg');

export default function Game() {
  const { roomId = '' } = useGlobalSearchParams() as { roomId: string; };

  const { user } = useMyUser();

  const [leftPlayers, setLeftPlayers] = useState<Player[]>([]);
  const [rightPlayers, setRightPlayers] = useState<Player[]>([]);

    useEffect(() => {
      const fetchData = async () => {
          // const data = await createGame({
          //   lowestBetAmount: 100,
          //   maximumCountOfPlayers: 3,
          //   allowPlayersToWatch: true,
          //   userId: 1
          // })

          // const data = await getAllRooms();

          // console.log(data, 'room')
      };

      fetchData();
  }, [roomId]);

  const { players } = usePlayers({ roomId });

  useEffect(() => {
    if (players?.length !== 0) {
      const [leftPlayers, rightPlayers] = splitArray(players);
      setLeftPlayers(leftPlayers);
      setRightPlayers(rightPlayers);
    }
    
  }, [players])

  const publicCards: (Poke | string)[] = ['c2', 'ct', 'h8', 's4', 'da'];

  return (
    <ImageBackground contentFit='cover' source={background} style={styles.container}>
      <View style={styles.left}>
        {
          leftPlayers.map((player) => {
            return <PlayerCard
              key={player.id}
              {...player}
              id={player.id}
            />
          })
        }
      </View>

      <View style={styles.middle}>
        <View style={styles.publicCards}>
          {
            publicCards.map((value, index) => {
              return <PokerCard key={index} hidden={!value} value={value} />
            })
          }
        </View>

        <ImageBackground
          style={styles.priceContainer}
          // source={background}
        >
          {/* {
            user?.id === 
          } */}
          <TouchableOpacity style={styles.begin}>
            <ImageBackground style={styles.imageBack} source={background}>
            <Text style={styles.startBtn}>发牌</Text>
            </ImageBackground>
          </TouchableOpacity>
          {/* <Image style={styles.coin} source={require('@/assets/images/coin.png')} /> */}
          {/* <Text style={styles.price}>$ 1000</Text> */}
        </ImageBackground>

        <View style={styles.actions}>
          <View style={styles.quickActions}>
            <View style={[styles.quickBtn]}>
              <Text style={[styles.btnText]}>/ 3</Text>
            </View>
            <View style={[styles.quickBtn]}>
              <Text style={[styles.btnText]}>/ 2</Text>
            </View>
            <View style={[styles.betPrice]}>
              {/* <Text style={[styles.betText]}>$ 333</Text> */}
            </View>
            <View style={[styles.quickBtn]}>
              <Text style={[styles.btnText]}>x2</Text>
            </View>
            <View style={[styles.quickBtn]}>
              <Text style={[styles.btnText]}>x3</Text>
            </View>
          </View>

          <View style={styles.mainBtns}>
            <View style={[styles.btn, styles.fold]}>
              <Text style={[styles.btnText]}>弃牌</Text>
            </View>
            <View style={[styles.btn, styles.bet]}>
              <Text style={[styles.btnText]}>下注</Text>
            </View>
            <View style={[styles.btn, styles.check]}>
              <Text style={[styles.btnText]}>过牌</Text>
            </View>
          </View>
        </View>

      </View>
      <View style={styles.right}>
        {
          rightPlayers.map((player) => {
            return <PlayerCard
              key={player.id}
              {...player}
              id={player.id}
            />
          })
        }
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    height: '100%',
    padding: 12,
    backgroundColor: '#222'
  },

  left: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '25%',
    height: '100%',
    // backgroundColor: '#1677ff'
  },

  middle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    // backgroundColor: 'green'
  },

  publicCards: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '100%',
    height: '30%',
    paddingTop: 24,
    paddingLeft: 12,
    paddingRight: 12,
  },

  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    // backgroundColor: 'red',
    borderRadius: '50%',
    // borderRadius: ,
    width: '100%',
    height: '40%',
  },

  begin: {
    width: '50%',
    height: '50%',
    borderRadius: 16,
    backgroundColor: '#007BFF'
  },

  imageBack: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startBtn: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 36
  },

  coin: {
    width: 200,
    height: 100,
    borderRadius: 36,
  },

  price: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 800
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'center',
    marginTop: 12,
    width: '100%',
    flex: 1,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6
  },

  quickActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },

  quickBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%',
    backgroundColor: '#444',
    borderRadius: 8
  },

  betPrice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '40%',
    borderRadius: 8
  },

  betText: {
    color: '#000',
    fontWeight: 500,
    fontSize: 16
  },

  mainBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
    marginTop: 4
  },

  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },

  btnText: {
    color: '#fff',
    fontWeight: 500,
    fontSize: 16
  },

  fold: {
    width: '25%',
    height: '100%',
    backgroundColor: 'red'
  },

  bet: {
    width: '40%',
    height: '100%',
    backgroundColor: 'green'
  },

  check: {
    width: '25%',
    height: '100%',
    backgroundColor: '#999'
  },

  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '25%',
    height: '100%',
    // backgroundColor: '#1677ff'
  },
});
