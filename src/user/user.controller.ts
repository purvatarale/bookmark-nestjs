import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {User} from '@prisma/client';
import { JwtGuard } from "src/auth/guard";

export interface RequestWithUser extends Request {
    user: User;
  }

@Controller('users')
export class UserController{
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Req() req:RequestWithUser){
        return req.user;
    }
}