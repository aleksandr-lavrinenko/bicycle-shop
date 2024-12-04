import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { PartOption, Prisma } from "@prisma/client";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class PartsRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async save(partOption: PartOption) {
    return await this.prisma.partOption.update({
      where: { id: partOption.id },
      data: { stock: partOption.stock },
    });
  }

  async listParts(
    productId: string,
    {
      startId,
      limit,
    }: {
      startId?: string;
      limit: number;
    }
  ) {
    const cachedRules = await this.cache.get(cacheKey);
    if (cachedRules) {
      return cachedRules;
    }

    const parts = await this.prisma.$queryRaw<
      Array<{ id: string; name: string; productId: string }>
    >(
      Prisma.sql`
      SELECT id, name, "productId"
      FROM "Part"
      WHERE "productId" = ${productId}
      ${startId ? Prisma.sql`AND id > ${startId}` : Prisma.sql``}
        AND "isActive" = TRUE
        AND "isDeleted" = FALSE
      ORDER BY id ASC
      LIMIT ${limit}
    `
    );

    return parts;
  }

  async listPartOptions(
    partId: string,
    selectedParts: string[],
    {
      startId,
      limit,
    }: {
      startId?: string;
      limit: number;
    }
  ) {
    const partOptions = await this.prisma.$queryRaw<
      Array<{ id: string; name: string; price: number; isProhibited: boolean }>
    >(
      Prisma.sql`
      SELECT 
        po.id, 
        po.name, 
        po.price,
        CASE WHEN pc."id" IS NOT NULL THEN true ELSE false END AS "isProhibited"
        CASE WHEN po."stock" == 0 true ELSE false END AS "isOutOfStock"
      FROM "PartOption" po
      LEFT JOIN "ProhibitedCombination" pc
        ON po."partId" = pc."partId" AND pc."restrictedPartId" = ANY (${Prisma.sql`${selectedParts}`})
      WHERE po."partId" = ${partId}
        ${startId ? Prisma.sql`AND po.id > ${startId}` : Prisma.sql``} 
        AND po.isActive = TRUE
        AND po.isDeleted = FALSE
      ORDER BY "isProhibited" ASC, po.id ASC
      LIMIT ${limit}
    `
    );

    return partOptions;
  }

  async getPartsWithPrices(parts: string[]) {
    const cachedRules = await this.cache.get(cacheKey);
    if (cachedRules) {
      return cachedRules;
    }

    return await this.prisma.$queryRaw<Array<{ id: string; price: number }>>(
      Prisma.sql`
SELECT 
po.id AS "id",
po.price AS "price",
FROM "PartOption" po
JOIN "Part" p ON po."partId" = p.id
WHERE po.id = ANY(${parts})
  AND po.isActive = TRUE
  AND po.isDeleted = FALSE;
`
    );
  }

  async addPart(
    productId: string,
    createPartDto: {
      name: string;
      category: string;
      description?: string;
      price: string;
      priceAdjustmentsRules: object[];
      stock: number;
    }
  ) {
    const { name, category, description, price, priceAdjustmentsRules, stock } =
      createPartDto;

    return await this.prisma.$transaction(async (prisma) => {
      // Insert the new part
      const part = await prisma.$executeRaw`
        INSERT INTO "Part" ("id", "category", "productId")
        VALUES (gen_random_uuid(), ${category}, ${description} ${productId})
        RETURNING "id";
      `;

      const partId = part[0].id; // Extract the newly inserted part ID

      // Insert the part option
      await prisma.$executeRaw`
        INSERT INTO "PartOption" ("id", "partId", "name", "description", "price", "stock")
        VALUES (gen_random_uuid(), ${partId}, ${name}, ${description}, ${price}, ${stock});
      `;

      // Insert the pricing adjustment rules
      for (const rule of priceAdjustmentsRules) {
        await prisma.$executeRaw`
          INSERT INTO "PricingRule" ("id", "productId", "partOptionId", "condition", "priceAdjustment")
          VALUES (gen_random_uuid(), ${productId}, ${partId}, ${JSON.stringify(
          rule.condition
        )}, ${rule.priceAdjustment});
        `;
      }

      return {
        message: "Part and associated details added successfully",
        partId,
      };
    });
  }
}
