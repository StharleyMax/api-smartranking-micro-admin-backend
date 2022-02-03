import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(`category: ${JSON.stringify(category)}`);

    await this.appService.create(category);
  }

  @MessagePattern('find-category')
  async findCategory(@Payload() _id: string) {
    if (_id) {
      return this.appService.findByIdCategory(_id);
    } else {
      return this.appService.findCategory();
    }
  }
}
