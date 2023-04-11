enum CjmEventEnum {
  click_feature = 1,
  view_page = 2,
  play_video = 3,
}

type TrackDataBase = {
  event: CjmEventEnum;            // 事件：1：功能点击;2页面浏览；3视频播放
  time: string;                   // 事件发生的时间
  userAgent?: string;             // 用户浏览器信息
  referrer?: string;              // 上一个页面url
  url?: string;                   // 当前页面url
  title?: string;                 // 当前页面title
};

type TrackData = TrackDataBase & {
  [key: string]: any;             // 自定义参数
};

type Options = {
  reportUrl: string;      // required     上报地址
  debug: boolean;         // non-required 是否开启debug模式
};

const REQUIRED_KEYS: (keyof TrackDataBase)[] = [
  'event',
  'time',
];

type LogEvent = {
  level: 'error' | 'success' | 'info' | 'warnning';
  message: string;
};

function log(event: LogEvent) {
  const { level, message } = event;
  const date = new Date();
  console.log(
    `%c[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}][cjm_tracker] ${message}`,
    `color: ${
      { error: 'red', success: 'green', info: 'skyblue', warnning: 'yellow' }[
        level
        ]
    }`,
  );
}

function base64Encode(str: string) {
  let result = '';
  try {
    result = btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        // @ts-ignore
        return String.fromCharCode('0x' + p1);
      }),
    );
  } catch (e) {
    result = str;
  }
  return result;
}

function isFunction(arg: any) {
  if (!arg) {
    return false;
  }
  let type = Object.prototype.toString.call(arg);
  return type === '[object Function]' || type === '[object AsyncFunction]';
}

function isString(arg: any) {
  return Object.prototype.toString.call(arg) === '[object String]';
}

function trim(str?: string) {
  return str?.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') || '';
}

function padZero(num: number) {
  return num < 10 ? `0${num}` : num;
}

function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
}

function _decodeURI(uri: string) {
  let result = uri;
  try {
    result = decodeURI(uri);
  } catch (e) {
    result = uri;
  }
  return result;
}

function getURL(url?: string) {
  if (isString(url)) {
    url = trim(url);
    return _decodeURI(url);
  } else {
    return _decodeURI(window.location.href);
  }
}

class CjmTracker {
  config: Partial<TrackData> = {};
  options: Options = {
    reportUrl: '',
    debug: false,
  };

  /**
   * 构造函数
   * @param {Object} options 配置
   * @param {Object} defaultConfig 默认参数
   */
  constructor(options: Options, defaultConfig: Partial<TrackData>) {
    this.config = defaultConfig;
    this.options = options;
    log({
      level: 'info',
      message: 'CjmTracker实例化成功',
    });
  }

  /**
   * 1.构造函数没有传入默认配置，则需要在合适的时机调用该方法设置默认配置
   * 2.构造函数传入默认配置，但需要修改默认配置时，也可以调用该方法修改默认配置
   * 注意：该方法会覆盖默认配置中的所有属性
   */
  addConfig(config: Partial<TrackData>) {
    this.config = { ...this.config, ...config };
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
  getBaseInfo() {
    return {
      ...this.config,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      title: document.title,
      url: getURL(),
      time: getTime(),
    };
  }

  /**
   * 上报
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
   * 手动上报
   */
  track(params: {
    event?: CjmEventEnum;
    [key: string]: any;
  }, callback?: Function) {
    // 获取基础信息
    const baseInfo = this.getBaseInfo();
    // 合并参数
    const trackData: Partial<TrackData> = {
      ...(!!params.event ? params : {...params, event: CjmEventEnum.click_feature}),
      ...baseInfo,
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

export {CjmTracker, CjmEventEnum};
