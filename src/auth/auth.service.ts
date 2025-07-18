import { ForbiddenException, Injectable } from "@nestjs/common";
// import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}
    async signup(dto:AuthDto){
        //generate hashed pass
        const hash = await argon.hash(dto.password);

        //save new user in db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash
                }
            });
    
            const { hash: _, ...userWithoutHash } = user;
            return userWithoutHash;
        }catch(error){
            if ( error instanceof PrismaClientKnownRequestError){
                if ( error.code === 'P2002'){
                    throw new ForbiddenException("Credentials Taken")
                }
            }
            throw error;
        }

        // delete (user as any).hash;
        //return new user
        // return user;
        // return { msg: 'I have signed up'};
    }
    signin(){
        return{ msg: 'I have signed in'};
    }
}