
export const dateFtt = (M: string, Time: Date | null | string | number = null) => {
	let s  = Time;
	if(typeof s === "number" && String(s).length <= 10){
         s = Math.floor(Number(s)) * 1000;
	 
	}else{
		s = s ? s : new Date().getTime();
	}
	let date: Date = Time ? new Date(s) : new Date();
	let pattern: RegExp = /(y{2,4}|m{1,2}|d{1,2}|H{1,2}|h{1,2}|M{1,2}|s{1,2}|c{1,2}|w{1,2})/g;
	let tmp: any = (S: string | number) => (Number(S) < 10 ? "0" + S : S);
	let res: string = M.replace(pattern, ($0: string) => {
		switch ($0) {
			case "yy":
				return date.getFullYear().toString().slice(-2);
			case "yyyy":
				return date.getFullYear();
			case "m":
				return date.getMonth() + 1;
			case "mm":
				return tmp(date.getMonth() + 1);
			case "d":
				return date.getDate();
			case "dd":
				return tmp(date.getDate());
			case "w":
				return date.getDay();
			case "ww":
				return ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
			case "h":
				return date.getHours();
			case "hh":
				return tmp(date.getHours());
			case "M":
				return date.getMinutes();
			case "MM":
				return tmp(date.getMinutes());
			case "s":
				return date.getSeconds();
			case "ss":
				return tmp(date.getSeconds());
			case "c":
				return Math.trunc(date.getTime() / 1000);
			case "cc":
				return date.getTime();
			default:
				return $0;
		}
	});
	return res;
};
export const getAllDate = (startTime: number, endTime: number) => {
	let dateList = [];
	let days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
	for (let i = 0; i < days; i++) {
		let tempDate = new Date(startTime + i * 24 * 60 * 60 * 1000);
		dateList.push(tempDate);
	}
	return dateList;
}

 