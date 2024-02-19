import morgan, { StreamOptions } from "morgan";
import Logger from "../config/logger";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  return process.env.NODE_ENV !== "development";
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;
