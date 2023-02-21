import { EducationDto } from "./EducationDto";
import { EducationCenterDto } from "./EducationCenterDto";
import { CenterDto } from "./CenterDto";
import { ProvinceDto } from "./ProvinceDto";
import { TechnologyDto } from "./TechnologyDto";
import { LevelDto } from "./LevelDto";
import { ActionDto } from "./ActionDto";

export class InternDto {

    id!: number;
    period: string | undefined;
    username: String | undefined;
    name: String | undefined;
    lastname: String | undefined;
    gender: number | undefined;
    email: String | undefined;
    education: EducationDto | undefined;
    educationCenter: EducationCenterDto | undefined;
    center: CenterDto | undefined;
    province: ProvinceDto | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    hours: number | undefined;
    customer: string | undefined;
    code: string | undefined;
    technologies: TechnologyDto[] | undefined;
    englishLevel: LevelDto | undefined;
    mentor: string | undefined;
    coordinator: string | undefined;
    hrManager: string | undefined;
    action: ActionDto | undefined;
    contractDate: Date | undefined;
    active: number | undefined;
    link: string | undefined;
    comment: string | undefined;
    delete: boolean = false;

    constructor() {}
}
  