export interface hrvAnalysisRecordData {
    id: number;
    bedNumber: string;
    name: string;
    ccid: string;
    time: string;
} 

export interface bloodPressureReportData{
   id: number;
    address: string;
    bedNumber: string;
    name: string;
    ccid: string;
    startTime: string;
    isPrint: boolean;
}