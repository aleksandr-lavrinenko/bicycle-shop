import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";

@Controller("auth")
export class SignInController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  async signIn(@Body() signInDto: { email: string; password: string }) {
    const { email, password } = signInDto;

    // Validate user and generate token
    const token = await this.authService.validateUser(email, password);
    if (!token) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { message: "Sign-in successful", token };
  }

  @Post("signup")
  async signUp(@Body() signUpDto: { email: string; password: string }) {
    const { email, password } = signUpDto;

    // Validate user and generate token
    const isExist = await this.authService.validateThatUseDoesNotExist(email);

    if (isExist) {
      throw new UnauthorizedException("User already exists");
    }
    const token = await this.authService.validateUser(email, password);
    if (!token) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { message: "Sign-in successful", token };
  }

  @Post("logout")
  async logout() {}
}
