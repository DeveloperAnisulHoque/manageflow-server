import { registerAs } from "@nestjs/config";


export default registerAs('role', () => ({
  seed: process.env.SEED_ROLES,
}))
