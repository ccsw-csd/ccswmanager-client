import { ProvinceDto } from "./ProvinceDto";

export class EducationCenterDto {

    id: number | undefined;
    name: string | undefined;
    type: string | undefined;
    province: ProvinceDto | undefined;

    constructor() {}
}