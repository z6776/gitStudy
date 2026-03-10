import { Md5 } from 'ts-md5'
 
export const getAssetsFileV2 = (url?: string) => {
  if (!url) {
    return ''
  }
  return new URL(`../../assets/images/V2/${url}`, import.meta.url).href
}

export const getAssetsFileV4 = (url?: string) => {
  if (!url) {
    return ''
  }
  return new URL(`../../assets/images/V4/${url}`, import.meta.url).href
}

/**
 * 获取资源文件的完整路径
 * @param url - 资源文件的相对路径，默认为undefined
 * @returns 返回资源的完整URL路径，如果未提供url则返回空字符串
 */
export const getAssetsFileImages = (url?: string) => {
  // 如果url未提供，则返回空字符串
  if (!url) {
    return ''
  }
  // 使用URL构造函数和import.meta.url创建资源的完整URL路径
  return new URL(`../../assets/images/${url}`, import.meta.url).href
}

export const getAssetsAddressFileNew = (url: string) => {
  return new URL(`../../assets/icon/${url}`, import.meta.url).href
}

export const getAssetsFileNew = (url: string) => {
  return new URL(`../../assets/watch/${url}`, import.meta.url).href
}

export const getAssetsIndexFileNew = (url: string) => {
  return new URL(`../../assets/images/statusimage/${url}`, import.meta.url).href
}

export const getAssetsRightAside = (url: string) => {
  return new URL(`../../assets/images/rightaside/${url}`, import.meta.url).href
}

export const getComMonAssets = (url: string) => {
  return new URL(`../../assets/images/rightMenus/${url}`, import.meta.url).href
}

export const getComMonAssetsV2 = (url: string) => {
  return new URL(`../../assets/images/V2/${url}`, import.meta.url).href
}

export const  getModelSuger = () => {
  return new URL(`../../assets/images/V2/sugericon.png`, import.meta.url).href
}

 

export const getScreenPx = (size: number) => {
  const screenWidth = window.innerWidth
  const ratio = screenWidth / 1920
  return size * ratio
}
// Md5.hashStr(String(paientInfo.value.id))+"xoJWeO24ZLU3xibLDv8aGaqN4M33Ee"
export const md5Str = (str: string, prefix: string = 'xoJWeO24ZLU3xibLDv8aGaqN4M33Ee') => {
  return Md5.hashStr(String(str)) + prefix
}

export function getRem(fontSize: number, baseScreenWidth = 1920) {
  // 获取当前屏幕宽度
  const clientWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return fontSize
  // 计算比例
  const scale = clientWidth / baseScreenWidth
  return Math.ceil(fontSize * scale)
}

export function scaleByHeight(base: number, baseScreenHeight = 1080) {
  // 获取当前屏幕宽度
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  if (!clientHeight) return base
  // 计算比例
  const scale = clientHeight / baseScreenHeight
  return Math.ceil(base * scale)
}



// 计算年龄（不足一岁返回天数）
export function calculateAge(birthdayStr: string): string | number {
  if (!birthdayStr) {
    return '--'
  }
  // 解析日期字符串
  const [year, month, day] = birthdayStr.split('-').map(Number)
  const birthday = new Date(year!, month! - 1, day)
  // 获取当前日期
  const today = new Date()
  // 计算年龄
  let age = today.getFullYear() - birthday.getFullYear()
  // 调整年龄（如果今年还没过生日，年龄减1）
  const monthDiff = today.getMonth() - birthday.getMonth()
  const dayDiff = today.getDate() - birthday.getDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }
  // 不足一岁，返回天数
  if (age < 1) {
    const diffTime = today.getTime() - birthday.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + '天'
  }
  return age + '岁'
}

/**
 * 姓名脱敏处理
 * @param {string} name 原始姓名
 * @returns {string} 脱敏后的姓名
 */
export function maskName(name: string) {
  if (!name || typeof name !== 'string') return '--'

  const length = name.length

  if (length <= 1) return name // 单字姓名不处理

  if (length === 2) {
    // 两个字：张*三
    return name.charAt(0) + '*'
  }

  if (length === 3) {
    // 三个字：张*三
    return name.charAt(0) + '*' + name.charAt(2)
  }

  // 四个字及以上：保留首尾，中间用星号
  const firstChar = name.charAt(0)
  const lastChar = name.charAt(length - 1)
  const middleStars = '*'.repeat(length - 2)

  return firstChar + middleStars + lastChar
}

// 判断不为空
export const value = (s: any): any | '--' => {
  if (s !== null && s !== undefined && s !== '') {
    return s
  }
  return '--'
}

/**
 * 节流函数
 * @param fn 需要执行的函数
 * @param wait 延迟时间（毫秒）
 * @param immediate 是否立即执行第一次
 * @returns 返回节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastTime = 0;
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    
    // 第一次是否立即执行
    if (immediate && !lastTime) {
      fn.apply(this, args);
      lastTime = now;
      return;
    }
    
    // 超过等待时间，执行函数
    if (now - lastTime >= wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      // 如果没有定时器，设置一个定时器在等待时间后执行
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, wait - (now - lastTime));
    }
  };
}


export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (fn) {  // 添加 fn 的存在性检查
        fn.apply(this, args);
      }
    }, wait);
  }
}




export function getDefaultValue<T extends string | null | undefined | number>(
  value: T,
  defaultValue: string = '--',
): T | '--' {
  return value !== null && value !== undefined && value !== '' ? value : (defaultValue as any)
}

export const styleToString = (o:Record<string,string>)=>{
       let str = "";
       for(let key in o){
         str+=key+":"+o[key]+";"
       }
       return str;
}


/**
 * 计算当前时间到指定时间戳的间隔
 * @param {number} timestamp - 目标时间戳（毫秒）
 * @returns {string} 时间间隔描述（如：2天3小时15分钟）
 */
export function getTimeInterval(timestamp: number): string {
    const now = Date.now();
    
    const diff =now-Number((timestamp*1000).toFixed(0));
    
    if (diff <= 0 || !timestamp) {
        return '--';
    }
    
    // 转换为分钟
    const totalMinutes = Math.floor(diff / (1000 * 60));
    
    // 计算小时
    const hours = Math.floor((totalMinutes / 60));
    // 计算分钟
    const minutes = totalMinutes % 60;
    
    // 构建返回字符串
    let result = [];
    if (hours > 0){
        result.push(`${hours < 10 ? '0'+hours  : hours}`);
    }else{
      result.push('00');
    }
    if (minutes > 0){
      result.push(`${minutes < 10 ? '0'+minutes  : minutes}`);
    }else{
        result.push('00');
    }
    return result.length === 0 ? '--' : result.join(':');
}

export const getHour = (sec:number)=>{
      if(!sec){
          return "--"
      }
      let hour = Math.floor(sec/3600);
      let min = Math.floor((sec%3600)/60) < 10 ? `0${Math.floor((sec%3600)/60)}` : Math.floor((sec%3600)/60);
      return `${hour}:${min}`
}

/**
 * 获取当前时间整点往前推24小时的时间范围
 * 格式: MM/DD HH:00 ~ MM/DD HH:00
 * 例如当前是 02/02 09:15，返回: 02/01 09:00 ~ 02/02 08:00
 * @returns {string} 格式化后的时间范围字符串
 */
export function getLast24HoursRange() {
  const now = new Date();
  
  // 当前时间的整点（向下取整）
  const currentHour = new Date(now);
  currentHour.setMinutes(0, 0, 0);
  
  // 24小时前的整点
  const past24Hours = new Date(currentHour);
  past24Hours.setHours(0, 0, 0, 0);
  
  // 格式化函数
  const formatDate = (date:any) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:00`;
  };
  
  return `${formatDate(past24Hours)} ~ ${formatDate(currentHour)}`;
}


export function toEchartArray(sec:any) {
      if(Object.keys(sec||{}).length>0 && typeof sec === 'object'){ 
             let result:any = [];
             Object.keys(sec).sort().forEach((key:any)=>{
                 result.push([new Date(key).getTime(),Number(sec[key])]);
             })
             return result;
      }else{
        return []
      }
}


// 动态设置两个区间
export function setLowHighText(_echarts:any,low:any,high:any,offset:number[]=[0,0]) {
      const currentOption:any = _echarts.getOption();
      console.log(currentOption,"currentOptioncurrentOption")
      let lenvalue = currentOption.xAxis?.[0]?.data[currentOption?.xAxis[0]?.data?.length-1] ?? '22:10';
      let position1 = _echarts.convertToPixel({ seriesIndex: 0 },[lenvalue, low]);
      let position2 = _echarts.convertToPixel({ seriesIndex: 0 },[lenvalue, high]);
        currentOption.graphic.find((elp:any) =>{
         elp.elements.forEach((el:any) =>{
             if(el.id === 'graphic1'){
                el.position = [position1[0]-offset[0]!,position1[1] - offset[1]!] 
             }
             if(el.id === 'graphic2'){
                el.position = [position2[0]-offset[0]!,position2[1] - offset[1]!] 
             }
         })
        
        });
         
      _echarts.setOption({
        graphic: currentOption.graphic
      });
}


export function deepClone(obj:any):any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const copyObj:any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copyObj[key] = deepClone(obj[key]);
            }
        }
        return copyObj;
    }
}





