import app from "./app";
import Logger from "./config/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
});
