import { Alert } from 'react-native';

import { quitRoom } from '@/service';

/**
 * 玩家退出房间
 * @param navigation 导航
 * @param roomId 房间ID
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const quitGame = async (navigation: any, roomId: string) => {
  Alert.alert('燕子、燕子、我不能没有你啊', '', [
    {
      text: '取消',
      style: 'cancel'
    },
    {
      text: '狠心离开',
      onPress: async () => {
        await quitRoom({ id: roomId });

        navigation.goBack();
      }
    }
  ]);
};
