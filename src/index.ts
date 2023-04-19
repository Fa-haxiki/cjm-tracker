import type {LogEvent, Options, TrackData} from "./types";
import {base64Encode, getDistinctId, getTime, getURL, isFunction, log} from "./utils";
import {addPageViewListener} from "./libs/pageview";
import {addWebClickListener} from "./libs/webclick";

const packageJson = require('../package.json');

const REQUIRED_KEYS: (keyof TrackData)[] = [
  'version',
  'event',
  'time',
  'project',
  'distinctId',
];

const SDK_TYPE = 'web';
const SDK_VERSION = packageJson.version;

class CjmTracker {
  /**
   * 默认参数
   */
  baseConfig: Partial<TrackData> = {};
  /**
   * 默认属性
   */
  baseProperties: Record<string, any> = {};
  options: Options = {
    reportUrl: '',
    debug: false,
    enablePVEvent: false,
    enableWebClickEvent: false,
  };

  /**
   * 构造函数
   * @param {Object} options 配置
   * @param {Object} defaultConfig 默认参数
   */
  constructor(options: Options, defaultConfig: Partial<TrackData>) {
    if (!!defaultConfig?.version) {
      throw new Error('version为保留字段，不允许设置默认值');
    }
    if (!!defaultConfig?.distinctId) {
      throw new Error('distinctId为保留字段，不允许设置默认值');
    }
    if (!options?.reportUrl) {
      throw new Error('reportUrl为必填字段');
    }
    if (!defaultConfig?.project) {
      throw new Error('project为必填字段');
    }
    this.baseConfig = {
      version: `${SDK_TYPE}_${SDK_VERSION}`,
      distinctId: getDistinctId(),
      ...defaultConfig
    };
    this.options = { ...this.options, ...options };
    log({
      level: 'info',
      message: `CjmTracker ${SDK_TYPE}_${SDK_VERSION} 实例化成功`,
    });
    if (!!this.options.enablePVEvent) {
      this.track('pageview');
      addPageViewListener((lastUrl: string) => {
        if (lastUrl !== location.href) {
          this.track('pageview');
        }
      });
    }
    if (!!this.options.enableWebClickEvent) {
      addWebClickListener((properties) => {
        this.track('webclick', properties);
      });
    }
  }

  /**
   * 针对不同的项目，可添加项目特有的预置属性
   */
  addProperties(properties: Record<string, any>) {
    this.baseProperties = { ...this.baseProperties, ...properties };
  }

  /**
   * 校验必填参数
   */
  checkRequiredParams(params: Partial<TrackData>) {
    let result = true;
    const lostKeys: string[] = [];
    REQUIRED_KEYS.forEach((key) => {
      if (!params[key]) {
        result = false;
        lostKeys.push(key);
      }
    });
    return {
      result,
      lostKeys,
    };
  }

  /**
   * 获取基础信息
   */
  getDefaultProperties() {
    return {
      $userAgent: navigator.userAgent,
      $referrer: document.referrer,
      $title: document.title,
      $url: getURL(),
    };
  }

  /**
   * 上报数据
   */
  imagePost(stringData: string) {
    if (!this.options?.reportUrl) {
      log({
        level: 'error',
        message: '上报地址为空',
      });
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = `${this.options.reportUrl}?data=${encodeURIComponent(stringData)}`;
  }

  /**
   * 添加追踪数据
   */
  track(event: string, customProperties?: object, callback?: Function) {
    // 合并参数
    const trackData: Partial<TrackData> = {
      time: getTime(),          // 时间戳
      event,                    // 事件名称
      ...this.baseConfig,       // 基础信息
      properties: {
        ...this.getDefaultProperties(), // 默认属性
        ...customProperties,    // 自定义属性
      },
    };
    // 校验必填参数
    const { result, lostKeys } = this.checkRequiredParams(trackData);
    if (!result) {
      this.log({
        message: `track -> 缺少必填参数: ${lostKeys.join(',')}`,
        level: 'error',
      });
      return;
    }

    let encodeDataString = '';

    try {
      const stringifyData = JSON.stringify(trackData);
      this.log({
        message: `track -> raw data:\n${stringifyData}`,
        level: 'success',
      });
      encodeDataString = base64Encode(stringifyData);
      this.log({
        message: `track -> encode data:\n${encodeURIComponent(encodeDataString)}`,
        level: 'success',
      });
    } catch (e) {
      encodeDataString = '';
      this.log({ message: 'track -> encode data error', level: 'error' });
    }

    if (encodeDataString) {
      this.imagePost(encodeDataString);
      if (isFunction(callback)) {
        callback?.(trackData);
      }
    }
  }

  log(event: LogEvent) {
    if (this.options.debug) {
      log(event);
    }
  }
}

export {CjmTracker};
