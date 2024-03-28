import { Controller, Get } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get('/')
  fetchAll() {
    return 'Action return coffees';
  }
}
