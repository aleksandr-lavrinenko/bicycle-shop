import { Module } from "@nestjs/common";
import { PartsService } from "../products_service/parts/parts.service";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  imports: [PartsService],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
