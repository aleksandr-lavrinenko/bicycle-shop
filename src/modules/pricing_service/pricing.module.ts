import { Module } from "@nestjs/common";
import { PartsService } from "../products_service/parts/parts.service";
import { PricingController } from "./pricing.controller";
import { PricingService } from "./pricing.service";

@Module({
  imports: [PartsService],
  controllers: [PricingController],
  providers: [PricingService],
})
export class PricingModule {}
