import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

const ackErrors = ['E11000'];

@Controller()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  logger = new Logger(PlayersController.name);

  @EventPattern('create-players')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log({ payload: player });

    try {
      await this.playersService.create(player);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('find-players')
  async find(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log({ payload: _id });

    try {
      if (_id) {
        return this.playersService.findPlayerById(_id);
      } else {
        return this.playersService.findPlayers();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-players')
  async update(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log({ payload: data });

    try {
      const { _id, player } = data;

      await this.playersService.updatePlayer(_id, player);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('delete-players')
  async delete(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log({ payload: _id });

    try {
      await this.playersService.delete(_id);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
