import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
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
        const secret = configService.get<string>('JWT_KEY');

        return {
          secret: configService.get<string>('JWT_KEY'),
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.register(),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    // CacheService,
    // TokenAllowListService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
