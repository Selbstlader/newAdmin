/** 随机
 * 
 */
export const ZlRandom = {
    /** 生成随机密码，默认10位
     * @param length 随机密码的长度，默认10位
     * @returns 返回密码
     */
    getRandomPassword(length: number = 10) {
        let res = ''
        let upperNumber = Math.floor(length / 2) // 大写字母的数量
        let lowerNumber = length - upperNumber - 1 // 小写字母的数量

        let randomList: string[] = []
        // 生成特殊字符串
        // let symbolList: string[] =['@','#','$','_'];//定义特殊字符数组
        // randomList[0] = symbolList[Math.floor(Math.random() * symbolList.length)];//生成0-9随机数
        randomList[0] = Math.floor(Math.random() * 9) + '';//生成0-9随机数
        
        // 生成大写字母
        for(let i = 0 ;i < upperNumber; i++){
            let upperRandom = Math.floor(Math.random() * 26);
            randomList.push(String.fromCharCode(65 + upperRandom));
        }
        // 生成小写字母
        for(let i = 0 ;i < lowerNumber; i++){
            let lowerRandom = Math.floor(Math.random() * 26);
            randomList.push(String.fromCharCode(97 + lowerRandom));
        }

        // 打乱randomList
        for (let i = 0; i < length; i++) {
            let randomNum = Math.floor(Math.random() * (length - i))
            res += randomList[randomNum]
            randomList.splice(randomNum, 1);
        }
        

        return res
    }
}