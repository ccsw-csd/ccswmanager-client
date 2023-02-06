import { CenterDto } from "./CenterDto";
import { ProvinceDto } from "./ProvinceDto";

export class PersonDto {

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

    delete: boolean = false;

    constructor() {}
}
