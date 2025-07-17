import { Injectable } from "@nestjs/common";
// import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}
    async signup(dto:AuthDto){
        //generate hashed pass
        const hash = await argon.hash(dto.password);

        //save new user in db
        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                hash
            }
        });

        const { hash: _, ...userWithoutHash } = user;
        return userWithoutHash;

        // delete (user as any).hash;
        //return new user
        // return user;
        // return { msg: 'I have signed up'};
    }
    signin(){
        return{ msg: 'I have signed in'};
    }
}