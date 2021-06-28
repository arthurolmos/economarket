import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenAllowListService } from './token-lists/token-allow-list.service';
import { CacheService } from './token-lists/cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_KEY'),
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // CacheService,
    // TokenAllowListService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
