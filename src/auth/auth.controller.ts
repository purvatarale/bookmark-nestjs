import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common"
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice:AuthService) {}
    @Post('signup')
    signup(
        @Body('email') email:string,
        @Body('password', ParseIntPipe) password:string,    
    ){
        console.log({
            email,
            typeofEmail: typeof email,
            password,
            typeofPassword: typeof password,
        });
        return this.authservice.signup()
    }
    @Post('signin')
    signin(){
        return this.authservice.signin()
    }
}