import {CreateCompanyDto} from "./CompanyDto";

export interface CreateUserDto {
    name?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
    phone?: number;
    company?: CreateCompanyDto;
    experience?: any;
}

export interface ICreateUerExperienceDto {
    companyName: string;
    description: string;
    title: string;
    time: {
        start: Date;
        end: Date;
    }
}

