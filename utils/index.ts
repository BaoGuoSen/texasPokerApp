import type { Player } from '@/types'


function splitArray(arr: Player[]) {
    const mid = Math.floor(arr?.length / 2);
    const firstHalf = arr?.slice(0, mid);
    const secondHalf = arr?.slice(mid);

    return [firstHalf, secondHalf];
}

export { splitArray };