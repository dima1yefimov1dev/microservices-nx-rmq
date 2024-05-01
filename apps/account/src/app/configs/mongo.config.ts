import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
     useFactory: (configService: ConfigService ) => ({
        uri: getMongoUrlString(configService)
     }),
     inject: [ConfigService],
     imports: [ConfigModule]
  }
}

const getMongoUrlString = (configService: ConfigService) => (
  configService.get('MONGODB_URL')
);
