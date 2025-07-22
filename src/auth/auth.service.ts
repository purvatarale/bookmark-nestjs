import { ForbiddenException, Injectable } from "@nestjs/common";
// import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { promises } from "dns";
import { access } from "fs";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
    async signup(dto: AuthDto) {
        //generate hashed pass
        const hash = await argon.hash(dto.password);

        //save new user in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            });

            // const { hash: _, ...userWithoutHash } = user;
            // return userWithoutHash;
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
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
    async signin(dto: AuthDto) {
        //find the user by id
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        //if user doesnt exist, throw exception
        if (!user)
            throw new ForbiddenException("Incorrect Credentials")

        //compare password
        const pwMatches = await argon.verify(user.hash, dto.password)
        //if password not matching throw exception
        if (!pwMatches)
            throw new ForbiddenException("Incorrect Password")
        //return user
        // const { hash: _, ...userWithoutHash } = user;
        // return userWithoutHash;
        // return{ msg: 'I have signed in'};
        return this.signToken(user.id, user.email);
    }
    async signToken(
        userId: number,
        email: string,
    ): Promise<{access_token:string}> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        })
        return{
            access_token:token
        }
    }
}