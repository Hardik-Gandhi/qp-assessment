import logger from "../service/logger.service";
import morgan from "morgan";

// Show routes called in console
const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    {
      stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => logger.http(message.trim()),
      },
    }
);

export default morganMiddleware;