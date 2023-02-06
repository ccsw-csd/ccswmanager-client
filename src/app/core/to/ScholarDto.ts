import { PersonDto } from "./PersonDto";

export class ScholarDto {
    id!: number;
    person: PersonDto|undefined;
    username: String|undefined;
    name: String|undefined;
    lastname: String|undefined;
    customer: String|undefined;
    hours: number|undefined;
    details: string|undefined;
    startDate: Date|undefined;
    endDate: Date|undefined;
    title: String|undefined;  
    pon: String|undefined;  
    action: String|undefined; 
    active: number|undefined;
    constructor() {}
}
  