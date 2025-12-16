import type { Request, Response, NextFunction, Express } from "express";
import { users } from "../db.ts";
import { logger } from "../index.ts";
import { celebrate, Segments } from "celebrate";
import { RegisterValidationScheme } from "./userModel.ts";

const AdminToken = process.env.ADMIN_TOKEN;

export const RegisterValidator = celebrate({
    [Segments.BODY]: RegisterValidationScheme
})

export const RegisterHandler = (req: Request, res: Response) => {
    logger.info(`REGISTRATION // Received POST from ${req.host} to ${req.url} // login: ${req.body.login}; email: ${req.body.email}`);
    const user = req.body;
    if (users.find(u => u.email === user.email)) {
        res.status(400).send({
            message: `Пользователь с таким email уже зарегистрирован`,
        })
        return;
    }
    const newUser = {
        id: users.length,
        ...user
    };
    users.push(newUser);
    res.status(201).send({
        message: "Пользователь зарегистрирован успешно",
        user: newUser,
    });
}

export const GetUsersHandler = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received GET from ${req.host} to ${req.url}`);
    if (req.headers.authorization === AdminToken) {
        res.status(200).send(users);
        return;
    }
    res.status(403).send({
        message: "Недостаточно прав"
    })
}

export const GetUserHandler = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received GET from ${req.host} to ${req.url}`);
    try {
        const userId = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            res.status(404).send({
                message: "Пользователь не найден"
            });
            return;
        }
        res.status(200).send(users);
    }
    catch (error) {
        next(`Ошибка при получении пользователя: ${error}`);
    }
}