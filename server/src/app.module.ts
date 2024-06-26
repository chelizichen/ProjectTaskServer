import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigType } from './constant/config'
import { UserModule } from './modules/user/user.module'
import { ProjectModule } from './modules/project/project.module'
import { TaskModule } from './modules/task/task.module'
import { AuthModule } from './modules/auth/auth.module'
import { FileModule } from './modules/file/file.module'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path'
import { cwd } from 'process'

// import { MessageModule } from './modules/message/message.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(cwd(), 'upload'),
      serveRoot: '/upload', // 需要添加'/' 此处相当于添加前缀
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(cwd(), 'web'),
      serveRoot: '/web', // 需要添加'/' 此处相当于添加前缀
      renderPath:"index.html"
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigType.DB_TYPE),
          host: configService.get(ConfigType.DB_HOST),
          port: configService.get(ConfigType.DB_PORT),
          username: configService.get(ConfigType.DB_USER),
          password: configService.get(ConfigType.DB_PASS),
          database: configService.get(ConfigType.DB_NAME),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as TypeOrmModuleOptions),
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    AuthModule,
    FileModule,
    // MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
