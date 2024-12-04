import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PricingRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async getPricingRules(selectedParts: string[]) {
    const cachedRules = await this.cache.get(cacheKey);
    if (cachedRules) {
      return cachedRules;
    }

    return await this.prisma.$queryRaw<
      Array<{ id: string; priceAdjustment: number; condition: object }>
    >(
      Prisma.sql`
SELECT 
pr.id AS "id",
pr.priceAdjustment AS "priceAdjustment",
pr.condition AS "condition",
FROM "PricingRule" pr
JOIN "PartOption" po ON pr."partOptionId" = po.id
WHERE pr.partOptionId = ANY(${selectedParts})
  AND po."isActive" = TRUE
  AND po."isDeleted" = FALSE;
`
    );
  }
}
