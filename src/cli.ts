import * as yargs from "yargs";
import { generateFakeAdmin } from "../tests/data/userFixture";
import { UserInterface } from "./models/user";
import { UserService } from "./services/userService";
import connectDB from "./config/db";
import { getErrorDetails } from "./utils/utils";
import Logger from "./config/logger";

connectDB();

const argv = yargs
  .command(
    "generate-admin <email> <password>",
    "Generate a new admin user",
    (yargs) => {
      yargs
        .positional("email", {
          describe: "Admin email",
          type: "string",
        })
        .positional("password", {
          describe: "Admin password",
          type: "string",
        });
    },
    async (argv) => {
      try {
        const adminDetails: UserInterface = generateFakeAdmin();

        adminDetails.email = argv.email as string;
        adminDetails.password = argv.password as string;

        const userService = new UserService();
        await userService.createUser(adminDetails);
        Logger.info("Admin user generated successfully!");
        process.exit(0);
      } catch (error: any) {
        const { errorMessage } = getErrorDetails(error);
        Logger.error(`Error generating admin: ${errorMessage}`);
        process.exit(1);
      }
    }
  )
  .help().argv;
