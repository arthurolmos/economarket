import { Module } from '@nestjs/common';
import { expo } from './expo.provider';
import { ExpoResolver } from './expo.resolver';
import { ExpoService } from './expo.service';

@Module({
  providers: [...expo, ExpoService, ExpoResolver],
  exports: [...expo],
})
export class ExpoModule {}
