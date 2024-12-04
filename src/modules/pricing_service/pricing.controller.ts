import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { PricingService } from "./pricing.service";
import { OptionalJwtAuthGuard } from "@/common/guards/OptionalJwtAuthGuard";

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // Admin managment
  @Post()
  async calculatePricingForProduct(
    @Body() calculatePriceDto: { selectedParts: string[] }
  ) {
    return await this.pricingService.calculatePricing(
      calculatePriceDto.selectedParts
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async calculatePricingForCart() {
    const userId = req.user?.id || null;
    const sessionId = req.cookies["sessionId"];

    return await this.pricingService.calculatePricingForCart(userId, sessionId);
  }
}
