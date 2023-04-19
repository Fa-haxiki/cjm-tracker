import type {LogEvent} from "../types";
import {v4} from "uuid";

export function log(event: LogEvent) {
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

export function base64Encode(str: string) {
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

export function isFunction(arg: any) {
  if (!arg) {
    return false;
  }
  let type = Object.prototype.toString.call(arg);
  return type === '[object Function]' || type === '[object AsyncFunction]';
}

export function isString(arg: any) {
  return Object.prototype.toString.call(arg) === '[object String]';
}

export function trim(str?: string) {
  return str?.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') || '';
}

export function padZero(num: number) {
  return num < 10 ? `0${num}` : num;
}

export function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
}

export function _decodeURI(uri: string) {
  let result = uri;
  try {
    result = decodeURI(uri);
  } catch (e) {
    result = uri;
  }
  return result;
}

export function getURL(url?: string) {
  if (isString(url)) {
    url = trim(url);
    return _decodeURI(url);
  } else {
    return _decodeURI(window.location.href);
  }
}

// 获取distinctId
export function getDistinctId() {
  const distinctId = localStorage.getItem('cjm_tracker_distinct_id') || '';
  if (distinctId) {
    return distinctId;
  }
  const newDistinctId = v4();
  localStorage.setItem('cjm_tracker_distinct_id', newDistinctId);
  return newDistinctId;
}
