import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  //create player
  async create(player: Player): Promise<Player> {
    try {
      const { email } = player;

      const existPlayer = await this.playerModel.findOne({ email }).exec();
      if (existPlayer) {
        throw new RpcException('E-mail already registered');
      }

      const createPlayer = new this.playerModel(player);
      return createPlayer.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findPlayers(): Promise<Player[]> {
    try {
      return this.playerModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async findPlayerById(_id: string): Promise<Player> {
    try {
      const players = await this.playerModel.findOne({ _id }).exec();
      return players;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async updatePlayer(_id, data: Player): Promise<Player> {
    try {
      const existPlayer = await this.playerModel.findOne({ _id }).exec();

      this.logger.log({ existPlayer });

      /*
      if (!existPlayer) {
        throw new RpcException('Player not found');
      }*/

      return this.playerModel.findOneAndUpdate({ _id }, { $set: data }).exec();
    } catch (error) {
      this.logger.error({ error });

      throw new RpcException(error.message);
    }
  }

  async delete(_id) {
    try {
      const existPlayer = await this.playerModel.findOne({ _id }).exec();

      if (!existPlayer) throw new RpcException('Player not found');

      return this.playerModel.findOneAndDelete({ _id }).exec();
    } catch (error) {
      this.logger.error({ error });

      throw new RpcException(error.message);
    }
  }
}
