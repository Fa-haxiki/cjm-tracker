# 超级码埋点 cjm-tracker

## Features

- 采用gif图片上报
- 支持自定义上报类型
- 支持自定义上报参数
- 支持自定义上报地址

## Install

```bash
$ npm install
```

```bash
$ npm run build
```

## Usage

1. 采用script标签引入的方式: 注意需要带上版本号

```html
<script src="https://unpkg.com/cjm-tracker@{version}/dist/umd/cjm-tracker.min.js"></script>
```

2. 采用npm引入的方式
    
```bash
$ npm install cjm-tracker
```
在项目中引入

```js
import {CjmTracker, CjmEventEnum} from 'cjm-tracker';
```
初始化参数需要根据实际业务来决定，以下为示例

```js
window.cjmTracker = new CjmTracker({
  reportUrl: '/api/xxxxx', // 上报地址
  debug: false, // 是否开启调试模式
}, {
  appName: 'xxx',
  appVersion: 'x.x.x',
  ... // 其他自定义参数
});
```

如果需要把一些公共参数添加到config中，可调用addConfig方法
例如在获取到用户信息后添加

```js
const userInfo = await getUserInfo();
window.cjmTracker.addConfig({
  userAccount: userInfo.account,
  userRole: userInfo.role,
  userArea: userInfo.area,
});
```
在需要上报的地方调用

```js
window.cjmTracker.track({
  event: CjmEventEnum.click_feature, // 上报类型， 默认为 click_feature，可不填
  funId: 'xxx', // 功能id
  funName: 'xxx', // 功能名称
}, () => {
  // 上报成功后的回调，可不填，同步执行
});
```

## Enum

```ts
// 上报类型
enum CjmEventEnum {
  click_feature = 1, // 点击功能
  view_page = 2,     // 查看页面
  play_video = 3,    // 播放视频
}
```

## LICENSE

MIT
