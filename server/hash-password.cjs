import { hashPassword } from "./src/utils/auth/bcrypt.js";

console.log(await hashPassword("Asdf@1234"));
