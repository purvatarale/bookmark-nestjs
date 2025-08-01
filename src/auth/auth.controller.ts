import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common"
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice:AuthService) {}
    @Post('signup')
    signup(
        @Body() dto:AuthDto, 
    ){
        console.log({dto});
        return this.authservice.signup(dto)
    }
    @Post('signin')
    signin(
        @Body() dto:AuthDto
    ){
        return this.authservice.signin(dto)
    }
}