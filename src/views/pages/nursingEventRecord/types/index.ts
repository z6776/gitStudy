import type { PatientInfoType } from "@/views/index/types/index";
import type { StringDefault } from "@/interface/interface";
export type nursingEventRecordType  = Pick<PatientInfoType,'patientId'|'name'|'bedNumber'|'patientNum'|'bindWatch'> & {
    jhid:number,
    jhtime:StringDefault
}
