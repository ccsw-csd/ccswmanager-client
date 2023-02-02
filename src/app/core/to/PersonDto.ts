import { CenterDto } from "./CenterDto";
import { ProvinceDto } from "./ProvinceDto";

export class PersonDto {
    id!: number;
    saga: String|undefined;
    username: String|undefined;
    name: String|undefined;
    email: String|undefined;
    lastname: String|undefined;
    center: CenterDto | undefined;
    grade: string|undefined;
    customer: string|undefined;
    role: string|undefined;
    province : ProvinceDto | undefined;
    active: number|undefined;
    hours: number|undefined;
    details: string|undefined;
    department: string|undefined;
    businesscode: string|undefined;
    manager: string|undefined;
    delete: boolean = false;
    constructor() {}
}
