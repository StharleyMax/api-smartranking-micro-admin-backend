import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './api/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.za85c.mongodb.net/smartranking-admin-backend?retryWrites=true&w=majority',
    ),
    CategoryModule,
  ],
})
export class AppModule {}
