import { Module } from "@nestjs/common";
import { ProductsService } from "./products/products.service";
import { ProductsController } from "./products/products.controller";
import { PartsController } from "./parts/parts.controller";
import { PartsService } from "./parts/parts.service";

@Module({
  imports: [],
  controllers: [ProductsController, PartsController],
  providers: [ProductsService, PartsService],
})
export class ProductsModule {}
