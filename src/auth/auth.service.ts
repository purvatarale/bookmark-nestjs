import { Injectable } from "@nestjs/common";
// import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}
    signup(){
        return { msg: 'I have signed up'};
    }
    signin(){
        return{ msg: 'I have signed in'};
    }
}