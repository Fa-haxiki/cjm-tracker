export type TrackData = {
  distinctId: string;               // 对用户的标识，填充UUID
  version: string;                  // 上传版本 客户端+版本号，web_1.0.0
  project: string;                  // 项目唯一标识
  event: string;                    // 事件名称
  time: string;                     // 事件发生的时间
  properties?: BaseProperties & {
    [key: string]: any;
  };                                // 自定义参数
};

export type BaseProperties = {
  $title: string;                   // 页面标题
  $url: string;                     // 页面url
  $referrer: string;                // 页面来源
  $userAgent: string;               // 用户代理
};

export type Options = {
  reportUrl: string;                // required     上报地址
  debug?: boolean;                  // non-required 是否开启debug模式
  enablePVEvent?: boolean;          // non-required 是否开启页面浏览事件自动上报, 默认不开启
  enableWebClickEvent?: boolean;    // non-required 是否开启页面点击事件自动上报，默认不开启
};

export type LogEvent = {
  level: 'error' | 'success' | 'info' | 'warnning';
  message: string;
};

export type WebClickEventProperties = {
  $elementId?: string;                // 点击元素的id
  $elementContent?: string | null;    // 点击元素的内容
  $elementClassName?: string;         // 点击元素的class
  $elementName?: string | null;       // 点击元素的name
  $elementType: string;               // 点击元素的类型
  $elementPath?: string;        // 点击元素到最外层元素组成的数组
};
