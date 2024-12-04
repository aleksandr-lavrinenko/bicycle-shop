import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getCartProductItems(cartProductId: string) {
    return await this.prisma.$queryRaw<
      Array<{ id: string; priceAdjustment: number; condition: object }>
    >(
      Prisma.sql`
SELECT 
cp.id AS "id",
cp.partOptionId AS "partOptionId",
FROM "CartProduct" cp
JOIN "CartItem" ci ON ci."cartProductId" = cp.id
WHERE cp.id = ${cartProductId}
  AND cp."isDeleted" = FALSE;
`
    );
  }
}
