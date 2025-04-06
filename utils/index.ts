import type { Player } from '@/types'

/**
 * 将数组分成两半，player.me 在右边第一个
 * @param arr 数组
 * @returns 两半的数组
 */
function splitArray(arr: Player[]) {
	const mid = Math.floor(arr?.length / 2);
	const firstHalf = arr?.slice(0, mid);
	const secondHalf = arr?.slice(mid);

	const leftPlayers = firstHalf.filter(player => !player.me);
	const rightPlayers = secondHalf.filter(player => !player.me);

	const me = secondHalf.find(player => player.me) || firstHalf.find(player => player.me);

	if (me) {
		rightPlayers.unshift(me);
	}

	return [leftPlayers, rightPlayers];
}

export { splitArray };