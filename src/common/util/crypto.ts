import  * as bcrypt from 'bcrypt'

export const hashPassword=(password:string)=>{
    return bcrypt.hash(password,10)
}

export const comparePassword=(password:string,hashPassword:string)=>{
    return bcrypt.compare(password,hashPassword)
}