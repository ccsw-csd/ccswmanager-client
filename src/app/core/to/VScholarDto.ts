import { ProvinceDto } from "./ProvinceDto";

export class VScholarDto {
    id!: number;
    saga: String|undefined;
    username: String|undefined;
    name: String|undefined;
    lastname: String|undefined;
    customer: String|undefined;
    hours: number|undefined;
    grade: string|undefined;
    role: string|undefined;
    province : ProvinceDto | undefined;
    email: string|undefined;
    centerId: number|undefined;
    businesscode: string|undefined;
    manager: string|undefined;
    details: string|undefined;
    startDate: Date|undefined;
    scholar_id: number|undefined;
    endDate: Date|undefined;
    title: String|undefined;  
    action: String|undefined;
    active: number|undefined;
    constructor() {}
}
  