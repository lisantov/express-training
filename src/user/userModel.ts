import { Joi } from 'celebrate';

export interface User {
    id: number;
    login: string;
    password: string;
    email: string;
}

export const RegisterValidationScheme = Joi.object({
    login: Joi.string().alphanum().min(6).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(60).required().pattern(/[\w!\-_]+/),
    repeat_password: Joi.string().valid(Joi.ref('password')).required(),
});