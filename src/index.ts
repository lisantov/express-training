import express from "express";
import winston from "winston";
import path from "path";

import 'dotenv/config';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import type { Request, Response, NextFunction } from 'express';

// Путь до текущего файла
const __filename = fileURLToPath(import.meta.url);
// Путь до текущей папки
const __dirname = dirname(__filename);


// Логгер, формат json и 'YYYY-MM-DD HH:mm:ss'
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json(),
    ),
    transports: [
        // Ошибки записываются в файл /logs/logs-error.json
        new winston.transports.File({
            filename: path.join(__dirname, "..", "logs", "logs-error.json"),
            level: "error",
        }),
        // Сообщения с информацией записываются в файл /logs/logs-combined.json
        new winston.transports.File({
            filename: path.join(__dirname, "..", "logs", "logs-combined.json"),
            level: "info",
        }),
    ]
})

// Если стоит DEV мод, то дебаг логи выводятся в консоль
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            level: "debug",
        })
    )
}

const app = express();
const port = process.env.PORT || 3000;

const raiseError = (errorText: string) => {
    throw new Error(errorText);
}

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = raiseError('Ашибка каакаято');
        res.status(200).send(data);
    }
    catch (error) {
        next(error);
    }
})

// Открывает публичный доступ к статике
app.use(express.static(path.join(__dirname, "public")));

// Логирование и возврат ошибки
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    res.status(500).send(err.message);
})

// Запуск сервера, либо на порте из .env, либо на 3000
app.listen(port, () => {
    logger.info("Server started on port " + port);
});
