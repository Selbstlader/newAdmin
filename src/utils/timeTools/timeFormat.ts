
/** 转换时间格式
 * 
 */
export const Format = (fmt: string, date = new Date()) => {
    if (!fmt) {
        console.error('Format====>请传入时间格式')
        return null
    }
    // fmt = fmt.replace(/-/g, "/")
    var o: any = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/** 上个月或下个月的今天，-1是上个月，1是下个月
 * 
 * @param num 
 * @param thisTime 
 * @returns 
 */
export const GetMonthDate = (num:number, thisTime?: Date | string) => {
  var date = thisTime? new Date(thisTime) : new Date();
  date.setMonth(date.getMonth() + num);
  var month = date.getMonth() + 1 ;
  var day = date.getDate();
  return date.getFullYear() + '/' + (month < 10 ? '0' + month: month) + '/' + (day < 10 ? '0' + day: day);
}

/** 获取某月的第一天
 * @param month string
 * @returns 
 */
export const GetMonthFirstDate = (month:string) => {
  return month.split('/')[0] + '/' + month.split('/')[1] + '/01'
}

/** 获取某月的最后一天
 * @param month string
 * @returns 
 */
export const GetMonthLastDate = (month:string, split: string = '/') => {
  return new Date(Number(month.split(split)[0]), Number(month.split(split)[1]), 0).getFullYear() + split + ((new Date(Number(month.split(split)[0]), Number(month.split(split)[1]), 0).getMonth() + 1) < 10 ? ('0' + (new Date(Number(month.split(split)[0]), Number(month.split(split)[1]), 0).getMonth() + 1)) : (new Date(Number(month.split(split)[0]), Number(month.split(split)[1]), 0).getMonth() + 1)) + split + new Date(Number(month.split(split)[0]), Number(month.split(split)[1]), 0).getDate()
}

/** 日期，在原有日期基础上，增加days天数，默认增加1天,负数为减少天数
 * 
 */
export const AddDate = (date1: string, days: number) => {
  if (days === undefined ) {
    days = 1
  }
  var date = new Date(date1)
  date.setDate(date.getDate() + days)
  var month:any = date.getMonth() + 1
  var day:any = date.getDate()
  var mm:any = '"' + month + '"'
  var dd:any = '"' + day + '"' // 单位数前面加0
  if (mm.length === 3) {
    month = '0' + month
  }
  if (dd.length === 3) {
    day = '0' + day
  }
  var time = date.getFullYear() + '/' + month + '/' + day
  return time
}


export const AddYear = (date: string, years: number, format: string = '/') => {
  let theDate =  new Date(date)
  theDate = new Date(theDate.setFullYear(theDate.getFullYear() + years))
  return Format(`yyyy${format}MM${format}dd`, theDate) || ''
}


export const GetTwoTimeBetween = (end: string, start?: string) => {
  let res = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    type: false
  }
  let endTime = new Date(end)
  let startTime = start ? new Date(start): new Date()

  let between = 0; // 时间差的毫秒数
  if (endTime > startTime) {
    between = endTime.getTime() - startTime.getTime()
    res.type = true
  } else {
    between = startTime.getTime() - endTime.getTime()
    res.type = false
  }
  // res.type = between > 0
  // if (res.type) between = -between
  // 计算年
  res.years = Math.floor(between / (24 * 3600 * 1000 * 365));

  // 计算月
  res.months = Math.floor(between / (24 * 3600 * 1000 * 30));

  // 计算天数
  res.days = Math.floor(between/(24 * 3600 * 1000))

  // 计算出小时数
  let leave1 = between % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  res.hours = Math.floor(leave1 / (3600 * 1000))

  // 计算相差分钟数
  let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  res.minutes = Math.floor(leave2 / (60 * 1000))

  // 计算相差秒数
  var leave3=leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  res.seconds = Math.round(leave3 / 1000)
  return res
}


// 计算两个日期之间的天数
export const GetDays = (strDateStart: string | null, strDateEnd: string) => {
  let start = strDateStart ? strDateStart.split(' ')[0] : ''
  let end = strDateEnd.split(' ')[0]
  let strSeparator = '/' // 日期分隔符
  let oDate1: any = ''
  let oDate2: any = ''
  let iDays: any = ''
  oDate1 = start.split(strSeparator)
  oDate2 = end.split(strSeparator)
  let strDateS: any = new Date(oDate1[0], oDate1[1] - 1, oDate1[2])
  let strDateE: any = new Date(oDate2[0], oDate2[1] - 1, oDate2[2])
  iDays = parseInt((Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24).toString()) // 把相差的毫秒数转换为天数
  return iDays
}


// 获取本周的周一和周日
export const GetWeek = () => {
  let now = new Date();
  let nowTime = now.getTime();
  let day = now.getDay();
  const dic = [0,1,2,3,4,5,6]
  let oneDayTime = 24 * 60 * 60 * 1000;
  return {
    monday: new Date(nowTime - (dic[day] - 1) * oneDayTime).toLocaleDateString().replace(/\//g, '-'),
    sunday: new Date(nowTime + (7 - dic[day]) * oneDayTime).toLocaleDateString().replace(/\//g, '-')
  }
}

