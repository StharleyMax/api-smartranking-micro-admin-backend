import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './api/categories/categories.module';
import { PlayersModule } from './api/players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.za85c.mongodb.net/smartranking-admin-backend?retryWrites=true&w=majority',
    ),
    CategoryModule,
    PlayersModule,
  ],
})
export class AppModule {}
