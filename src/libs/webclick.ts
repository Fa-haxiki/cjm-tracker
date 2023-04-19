import {WebClickEventProperties} from "../types";

/**
 * 获取元素的关系字符串(从子级一直递归到最外层)
 * 例如两层div的关系会得到字符串: div>div
 */
export function getNodeXPath(node: Element, curPath = ''): string {
  if (!node) return curPath
  const parent = node.parentElement
  const { id } = node
  const tagName = node.tagName.toLowerCase()
  const path = curPath ? `>${curPath}` : ''

  if (
    !parent ||
    parent === document.documentElement ||
    parent === document.body
  ) {
    return `${tagName}${path}`
  }

  if (id) {
    return `#${id}${path}` // 知道了id 就不需要获取上下级关系了(id是唯一的)
  }

  return getNodeXPath(parent, `${tagName}${path}`)
}

export function addWebClickListener(callback: (properties: WebClickEventProperties) => void) {
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const $elementId = target.id;
    const $elementContent = target.textContent?.slice(0, 128); // 长度限制128字符
    const $elementClassName = target.className;
    const $elementName = target.getAttribute('name');
    const $elementType = target.tagName;
    const $elementPath = getNodeXPath(target).slice(-128); // 长度限制128字符
    if ($elementType === 'BODY') return; // 点击body不上报，无意义
    callback({
      $elementId,
      $elementContent,
      $elementClassName,
      $elementName,
      $elementType,
      $elementPath,
    });
  });
}
