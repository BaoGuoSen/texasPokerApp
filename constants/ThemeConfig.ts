export interface ThemeConfig {
  /**
   * 默认用户头像
   */
  defaultAvatar?: string;
  /**
   * 首页背景图
   */
  homeBackImg?: string;
  /**
   * 首页背景色
   */
  homeBackColor?: string;
  /**
   * 房间列表空态动效
   */
  roomEmptyLottie?: string;
  /**
   * 游戏背景图
   */
  gameBackImg?: string;
  /**
   * 游戏背景色
   */
  gameBackColor?: string;
  /**
   * 默认玩家背景图
   */
  playerBackImg?: string;
  /**
   * 扑克牌背景图
   */
  pokerBackImg?: string;
  /**
   * 扑克牌背景色
   */
  pokerBackColor?: string;
  /**
   * 玩家卡片姓名颜色
   */
  playerNameColor?: string;
  /**
   * 操作玩家圆框动效颜色
   */
  playerActionColor?: string;
}

export const ThemeConfig: ThemeConfig = {
  defaultAvatar: require('@/assets/images/avator_2.png'),
  homeBackImg: require('@/assets/images/Cosmic-eidex-eidex_black.svg'),
  homeBackColor: '#222',
  roomEmptyLottie: require('@/assets/images/home_back_lottie.json'),
  gameBackImg: require('@/assets/images/Cosmic-eidex-eidex_black.svg'),
  gameBackColor: '#222',
  playerBackImg: require('@/assets/images/background_3.png'),
  pokerBackImg: require('@/assets/images/Cosmic-eidex-eidex_black.svg'),
  pokerBackColor: '#fff',
  playerNameColor: 'red',
  playerActionColor: 'red'
};
