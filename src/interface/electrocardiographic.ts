export interface ElectrocardiographicSearch {
  page:number	
  perPage:number
  name: string
  ccid: string
  status?: number  // 1表示绑定， 2表示未绑定
  bind?:number   // 0全部,1入院,2出院
}