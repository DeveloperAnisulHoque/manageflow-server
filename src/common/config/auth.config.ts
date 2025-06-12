import { registerAs } from "@nestjs/config";


export default registerAs("auth",()=>(
    {
        jwtSecret:process.env.JWT_SECRET,
        jwtExpiration:process.env.JWT_EXPIRATION,
        refreshJwtSecret:process.env.REFRESH_JWT_SECRET,
        refreshJwtExpiration:process.env.REFRESH_JWT_EXPIRATION,
    }
))