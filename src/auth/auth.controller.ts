import { Body, Controller,  Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterUserDTO } from 'src/libs/dto';
import { LocalAuthGuard } from './guard/local.guard';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Get('')
    @UseGuards(JwtAuthGuard)
    async test(@Request() request: any) {
      const authHeader = request.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : null;
      return await this.authService.authenticate(request.user, token);
    }
    @Post('register')
    async registerUser(@Body() registerUserDTO: RegisterUserDTO) {
      return await this.authService.register(registerUserDTO);
    }
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async loginUser(@Request() request: any, @Body() loginDTO: LoginDTO) {
      return await this.authService.login(request.user, loginDTO);
    }    
}
