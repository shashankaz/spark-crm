import "dotenv/config";
import { hashPassword } from "./src/utils/auth/bcrypt";

console.log(await hashPassword("Asdf@1234"));
