import {isFunction} from "../utils";

export function addPageViewListener(callback: Function) {
  let lastUrl = location.href;
  const historyPushState = window.history.pushState;
  const historyReplaceState = window.history.replaceState;

  if (isFunction(window.history.pushState)) {
    window.history.pushState = function () {
      // @ts-ignore
      historyPushState.apply(window.history, arguments);
      callback(lastUrl);
      lastUrl = location.href;
    };
  }

  if (isFunction(window.history.replaceState)) {
    window.history.replaceState = function () {
      // @ts-ignore
      historyReplaceState.apply(window.history, arguments);
      callback(lastUrl);
      lastUrl = location.href;
    };
  }

  let singlePageEvent;
  // @ts-ignore
  if (window.document.documentMode) {
    singlePageEvent = 'hashchange';
  } else {
    // @ts-ignore
    singlePageEvent = historyPushState ? 'popstate' : 'hashchange';
  }

  window.addEventListener(singlePageEvent, function () {
    callback(lastUrl);
    lastUrl = location.href;
  });
}
