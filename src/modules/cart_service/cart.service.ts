import { PartsService } from "../products_service/parts/parts.service";
import { CartRepository } from "./cart.repository";

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly partsService: PartsService
  ) {}

  async getCartContent({
    userId,
    sessionId,
  }: {
    userId?: string;
    sessionId?: string;
  }) {
    return await getOrCreateCart(userId, sessionId);
  }

  async addProductToCart({
    userId,
    sessionId,
    productId,
    selectedItemsIds,
  }: {
    userId?: string;
    sessionId?: string;
    productId: string;
    selectedItemsIds: string[];
  }) {
    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    return await this.cartRepository.addProductToCart(
      productId,
      selectedItemsIds
    );
  }

  async calculateCart(selectedParts: string[]) {
    const partOptions = await this.partsService.getPartsWithPrices(
      selectedParts
    );

    const basePrice = partOptions.reduce(
      (total, option) => total + Number(option.price),
      0
    );

    const cartRules = await this.cartRepository.getCartRules(selectedParts);

    let adjustedPrice = basePrice;
    for (const rule of cartRules) {
      if (this.isRuleApplicable(rule.condition, selectedParts)) {
        adjustedPrice += Number(rule.priceAdjustment);
      }
    }

    return adjustedPrice;
  }

  private async getOrCreateCart(userId?: string, sessionId?: string) {
    let cart;
    if (userId) {
      // Fetch the cart for authenticated user
      cart = await this.cartRepository.getCardForUser(userId);
    } else if (sessionId) {
      // Fetch or create a cart for anonymous user
      cart = await this.cartRepository.getCardForSession(sessionId);

      if (!cart) {
        cart = await this.cartRepository.createCart(sessionId);
      }
    }
    return cart;
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
