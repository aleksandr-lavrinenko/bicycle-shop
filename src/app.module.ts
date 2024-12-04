import { Logger, MiddlewareConsumer, Module } from "@nestjs/common";
import { ProductsModule } from "./modules/products_service/products.module";
import { PricingModule } from "./modules/pricing_service/pricing.module";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { SessionMiddleware } from "./common/middleawre/SessionMiddleware";
import { CartModule } from "./modules/cart_service/cart.module";

@Module({
  imports: [
    ProductsModule,
    PricingModule,
    CartModule,
    CacheModule.register({
      store: redisStore,
      host: "localhost",
      port: 6379,
      ttl: 600,
    }),
  ],
  providers: [Logger],
  exports: [CacheModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes("*");
  }
}
