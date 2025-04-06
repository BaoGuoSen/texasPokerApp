import type { GameEndRes } from '@/types/game';

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';
import { GameConfig } from '@/constants/gameConfig';

/**
 * 游戏结算
 */
const GameSettle = () => {
	const [texts, setTexts] = useState<string[]>([]);
	const translateX = useRef(new Animated.Value(300)).current;

	useWebSocketReceiver({
		handlers: {
			[GameWSEvents.GameStart]: () => {
				setTexts([]);
			},

			[GameWSEvents.GameEnd]: (gameEndRes: GameEndRes) => {
				const { settleList } = gameEndRes;

				setTexts(settleList.map((item) => `${item.userId} ${item.amount}`));
			}
		},
	});

	useEffect(() => {
		if (texts.length > 0) {
			fadeIn();

			const timer = setTimeout(fadeOut, GameConfig.settleDuration);
			return () => clearTimeout(timer);
		}
	}, [texts]);

	// 淡入动画
	const fadeIn = () => {
		Animated.timing(translateX, {
			toValue: 0,
			duration: 1000,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start();
	};

	// 淡出动画
	const fadeOut = () => {
		Animated.timing(translateX, {
			toValue: 300,
			duration: 300,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View style={[styles.container]}>
			{
				texts.map((text, index) => {
					return <Animated.Text key={index} style={[styles.text, { transform: [{ translateX }] }]}>{text}</Animated.Text>
				})
			}
		</Animated.View>
	);
};

// 样式
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: '35%',
		alignSelf: 'center',
		height: '100%',
		overflow: 'hidden',
		maxWidth: '100%',
	},

	text: {
		color: '#fff',
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'left'
	},
});

export default GameSettle;