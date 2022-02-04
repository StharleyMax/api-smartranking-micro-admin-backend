import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

const ackErrors = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`category: ${JSON.stringify(category)}`);

    try {
      await this.appService.create(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      ackErrors.map(async (ackErrors) => {
        if (error.message.includes(ackErrors)) {
          await channel.ack(originalMessage);
        }
      });
    }
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
