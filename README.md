# 超级码埋点 cjm-tracker

> My NodeJs Version: v14.20.0

## Features

- 采用gif图片上报
- 支持自定义上报类型，自定义上报参数，自定义上报地址
- PV采集
- 元素点击采集

## Install

```bash
$ npm install
```

```bash
$ npm run build
```

## Usage

1. 采用script标签引入的方式: 注意需要带上版本号，不带版本默认最新

```html
<script src="https://unpkg.com/cjm-tracker@{version}/dist/umd/cjm-tracker.min.js"></script>
```

2. 采用npm引入的方式
    
```bash
$ npm install cjm-tracker
```
在项目中引入

```js
import {CjmTracker} from 'cjm-tracker';
```
初始化参数需要根据实际业务来决定，以下为示例

```js
window.cjmTracker = new CjmTracker({
  reportUrl: '/api/xxxxx', // 上报地址
  debug: false, // 是否开启调试模式
  enablePVEvent: true, // 是否开启PV采集
  enableWebClickEvent: true, // 是否开启元素点击采集
}, {
  project: 'xxx', // 项目唯一标识
});
```

自定义上报，例如：采集功能点击事件

```js
window.cjmTracker.track(
  'feature_click', // 自定义上报事件英文名
  {
    funId: 'xxx', // 功能id
    funName: 'xxx', // 功能名称
  }, 
  () => {
    // 上报成功后的回调，可不填，同步执行
  }
);
```

## API

### new CjmTracker(options, defaultConfigs)

- options {Object} 配置项
  - reportUrl {String} 上报地址, 必填
  - debug {Boolean} 是否开启调试模式, 默认false
  - enablePVEvent {Boolean} 是否开启PV采集, 默认false
  - enableWebClickEvent {Boolean} 是否开启元素点击采集, 默认false
- defaultConfigs {Object} 默认上报参数
  - project {String} 项目唯一标识，必填

### tracker.track(eventName, properties?, callback?)

- eventName {String} 自定义上报事件英文名, 必填
- properties {Object} 自定义上报参数, 可选
- callback {Function} 上报成功后的回调，可不填，同步执行
