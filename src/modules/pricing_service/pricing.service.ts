import { PartsService } from "../products_service/parts/parts.service";
import { PricingRepository } from "./pricing.repository";

export class PricingService {
  constructor(
    private readonly pricingRepository: PricingRepository,
    private readonly partsService: PartsService
  ) {}

  async calculatePricing(selectedParts: string[]) {
    const partOptions = await this.partsService.getPartsWithPrices(
      selectedParts
    );

    const basePrice = partOptions.reduce(
      (total, option) => total + Number(option.price),
      0
    );

    const pricingRules = await this.pricingRepository.getPricingRules(
      selectedParts
    );

    let adjustedPrice = basePrice;
    for (const rule of pricingRules) {
      if (this.isRuleApplicable(rule.condition, selectedParts)) {
        adjustedPrice += Number(rule.priceAdjustment);
      }
    }

    return adjustedPrice;
  }

  // example of condition: { "requiredPartId": "uuid" },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isRuleApplicable(condition: any, selectedParts: string[]): boolean {
    if (
      condition.requiredPartId &&
      !selectedParts.includes(condition.requiredPartId)
    ) {
      return false;
    }
    return true;
  }
}
