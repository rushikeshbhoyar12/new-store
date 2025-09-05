import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'NestJS application is running!';
  }

  @Post('test')
  testPost(@Body() body: any): any {
    return { message: 'Test POST endpoint working', received: body };
  }
}