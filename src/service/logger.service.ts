import winston from "winston";

const { combine, timestamp, colorize, printf } = winston.format;

const logger = winston.createLogger({
  level: 'http',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;