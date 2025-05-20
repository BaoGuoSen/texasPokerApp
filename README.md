# Texas Poker App 🎮

一个使用 React Native 和 Expo 开发的德州扑克游戏应用。

## 功能特性

- 🎲 完整的德州扑克游戏体验
- 📱 响应式设计，支持 iOS 和 Android
- 🎨 现代化的 UI 界面
- 🔄 实时游戏状态更新
- 🎯 流畅的动画效果
- 🌐 支持在线对战

## 技术栈

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Router
- Texas Poker Core
- 其他主要依赖:
  - Lottie React Native (动画)
  - React Native Reanimated (手势动画)
  - React Native Linear Gradient (渐变效果)
  - Axios (网络请求)

## 项目结构

```
├── app/                # 主要应用代码
│   ├── (tabs)/        # 标签页导航
│   ├── game.tsx       # 游戏主界面
│   └── _layout.tsx    # 应用布局
├── components/        # 可复用组件
├── contexts/         # React Context
├── constants/        # 常量定义
├── hooks/           # 自定义Hooks
├── service/         # API服务
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
└── assets/          # 静态资源
```

## 开始使用

### 环境要求

- Node.js (推荐 v16 或更高版本)
- npm 或 yarn
- Expo CLI
- iOS Simulator (Mac) 或 Android Studio (Android 开发)

### 安装步骤

1. 克隆项目

   ```bash
   git clone [项目地址]
   cd texas-poker-app
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动应用

   ```bash
   npx expo start
   ```

4. 运行平台
   - iOS: 按 `i` 在 iOS 模拟器中运行
   - Android: 按 `a` 在 Android 模拟器中运行
   - 扫描二维码在 Expo Go 中运行

## 开发命令

- `npm start` - 启动 Expo 开发服务器
- `npm run ios` - 在 iOS 模拟器中运行
- `npm run android` - 在 Android 模拟器中运行
- `npm run web` - 在 Web 浏览器中运行
- `npm test` - 运行测试
- `npm run lint` - 运行代码检查

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT License](LICENSE)

## 作者

- thesen
- xuan
