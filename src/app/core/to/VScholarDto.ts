import { CenterDto } from "./CenterDto";
import { ProvinceDto } from "./ProvinceDto";

export class VScholarDto {

    id!: number;
    saga: String|undefined;
    username: String|undefined;
    email: String|undefined;
    name: String|undefined;
    lastname: String|undefined;
    center: CenterDto | undefined;
    province : ProvinceDto | undefined;
    businesscode: string|undefined;
    active: number|undefined;
    grade: string|undefined;
    customer: string|undefined;
    role: string|undefined;
    details: string|undefined;
    hours: number|undefined;
    department: string|undefined;
    manager: string|undefined;

    scholarId: number|undefined;
    startDate: Date|undefined;
    endDate: Date|undefined;
    title: String|undefined;  
    action: String|undefined;

    delete: boolean = false;

    constructor() {}
}
  