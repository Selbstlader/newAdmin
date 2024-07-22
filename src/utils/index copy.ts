export * as CommonTools from './commonTools';               // 通用工具
export * as TimeTools from './timeTools';                   // 时间工具
export * as DataTools from './dataTools';                   // 数据处理工具
export * as StorageTools from './storageTools';             // 缓存处理工具
export * as FileTools from './fileTools';                   // 文件工具


// 首字母大小
export function titleCase(str: string) {
    return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(str: string) {
    return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase());
}

export function isNumberStr(str: string) {
    return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}

/**
 *
 * @param {*} fn  是我们需要包装的事件回调
 * @param {*} delay 是每次推迟执行的等待时间
 */
export const debounce = (fn: any, delay = 400) => {
    let timer: any;
    return function (...args: any) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(null, args);
      }, delay);
    };
  };