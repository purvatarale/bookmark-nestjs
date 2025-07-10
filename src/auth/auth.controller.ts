import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authservice:AuthService) {}
    @Post('signup')
    signup(@Body() dto:any){
        console.log({
            dto,
        });
        return this.authservice.signup()
    }
    @Post('signin')
    signin(){
        return this.authservice.signin()
    }
}