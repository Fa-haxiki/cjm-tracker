# 超级码埋点 cjm-tracker

[![NPM version](https://img.shields.io/npm/v/cjm-tracker.svg?style=flat)](https://npmjs.org/package/cjm-tracker)
[![NPM downloads](http://img.shields.io/npm/dm/cjm-tracker.svg?style=flat)](https://npmjs.org/package/cjm-tracker)

## Features

- [x] 采用gif图片上报
- [x] 支持自定义上报类型
- [x] 支持自定义上报参数
- [x] 支持自定义上报地址

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
<script src="https://unpkg.com/cjm-tracker@0.0.2/dist/umd/cjm-tracker.min.js"></script>
```

```js
// 在项目中引入
import Tracker from 'cjm-tracker';

window.cjmTracker = new Tracker({
  reportUrl: 'http://localhost:3000/', // 上报地址
  debug: false, // 是否开启调试模式
}, {
  appName: 'xxx',
  appVersion: 'x.x.x',
  appId: 'xxx',
});
```

```js
// 在获取到用户信息后添加配置, 例如:
const userInfo = await getUserInfo();
window.cjmTracker.setConfig({
  userAccount: userInfo.account,
  userRole: userInfo.role,
  userArea: userInfo.area,
  userSource: userInfo.source,
});
```

```js
// 在需要上报的地方调用
window.cjmTracker.track({
  type: 'click_feature', // 上报类型， 默认为 click_feature，可不填
  extra: {
    featureId: 'xxx', // 功能id
  },
});
```

## LICENSE

MIT
