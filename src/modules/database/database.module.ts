import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPEORM_CONFIGS } from 'src/configs/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIGS)],
})
export class DatabaseModule {}
