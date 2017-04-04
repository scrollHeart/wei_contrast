import md5 from 'js-md5'

/**
 * [setDate 获取当前时间的上一个月]
 * @return {[string]}      [时间字符串：‘2017-01’]
 */
export function setDate(isHasDay) {
  let timeStr, y, m, d, date
  timeStr = new Date('2016-10')
  y = timeStr.getFullYear()
  m = timeStr.getMonth()
  d = timeStr.getDay()
  if (m < 10) m = `0${m}`
  if (d < 10) d = `0${d}`

  date = isHasDay ? `${y}-${m}-${d}` : `${y}-${m}`
  return date
}

/**
 * [setOriginDate 获取当前时间yyyy-mm-dd] 
 * @return {[string]}     [时间字符串：‘2017-01-01’]
 */
export function setOriginDate(isHasDay) {
  let timeStr, y, m, d, date
  timeStr = new Date('2016-10')

  y = timeStr.getFullYear()
  m = timeStr.getMonth() + 1
  d = timeStr.getDay()

  if (m < 10) m = `0${m}`
  if (d < 10) d = `0${d}`

  date = isHasDay ? `${y}-${m}-${d}` : `${y}-${m}`
  return date
}

/**
 * [getStartTime 获取开始时间（当前时间的上一个月）]
 * @param  {[string]} time [eg: '2017-01']
 * @return {[string]}      [时间字符串：‘2016-12-01’]
 */
export function getStartTime(time) {
  let date = new Date(time)
  let y = date.getFullYear()
  let m = date.getMonth()
  if (m < 1) {
    y = --y
    m = 12
  }
  m = m < 10 ? '0' + m : m

  let d = date.getDate()
  d = d < 10 ? '0' + d : d

  return `${y}-${m}-${d}`
}

/**
 * [getEndTime 获取结束时间（当前时间）]
 * @param  {[obj]} self [this指向]
 * @return {[string]}      [eg：2017-01-01]
 */
export function getEndTime(time) {

  let date = new Date(time)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  if (m < 10) m = `0${m}`
  let d = date.getDate()
  if (d < 10) d = `0${d}`

  return `${y}-${m}-${d}`

}

/**
 * [setTimePoint 时间点：上一个月、下一个月操作]
 * @param {[obj]} obj [设置的信息对象：self（this指向），timePoint（当前时间点），isPrev：是否为执行上一个月操作]
 */
export function setTimePoint(obj) {
  let year, month, now, next, _newDate, isPrev

  year = Number((obj.timePoint).substr(0, 4))
  month = Number((obj.timePoint).substr(5))
  isPrev = obj.isPrev

  if (isPrev) {
    if (month === 1) {
      month = 12
      year -= 1
    } else {
      month -= 1
    }
  } else {
    if (month === 12) {
      month = 1
      year += 1
    } else {
      month += 1
    }
  }

  if (month < 10) {
    month = '0' + month
  }
  _newDate = `${year}-${month}`
  obj.self.time = _newDate
  obj.self.PageIndex = 1
}

/**
 * [setMd5 排序请求对象属性，及post请求参数加密]
 * @param {[obj]} dataObj [请求的参数对象]
 * @return {[obj]} 返回经过排序后的请求参数对象，及md5加密后的值
 */
export function setMd5(dataObj) {
  /*----- 对象排序start -----*/
  let arr, obj
  arr = []
  obj = {}
  for (let key in dataObj) {
    arr.push(key)
  }
  arr.sort()
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = dataObj[arr[i]]
  }
  /*----- 对象排序end -----*/
  // md5加密
  let key = '04165ba7c66aertvk'
  let sign = md5(`${JSON.stringify(obj)}|${key}`).toUpperCase()
  return {
    obj: obj,
    sign: sign
  }
}