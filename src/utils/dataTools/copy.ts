
/** 深拷贝
 * @param original 原数据
 * @returns 返回数据
 */
export const  deepCopy = (original: any) => {
    if (!original) return undefined
    return JSON.parse(JSON.stringify(original))
}