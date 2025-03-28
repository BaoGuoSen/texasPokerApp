import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Actions = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default Actions;