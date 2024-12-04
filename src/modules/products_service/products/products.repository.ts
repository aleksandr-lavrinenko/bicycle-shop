import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class ProductsRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async list(categoryId?: string) {
    const cachedRules = await this.cache.get(cacheKey);
    if (cachedRules) {
      return cachedRules;
    }

    // Load from database

    return {};
  }

  async createProduct({
    category,
    description,
    partsForCustomizations,
  }: {
    category: string;
    description?: string;
    partsForCustomizations: { category: string }[];
  }) {
    return await this.prisma.$transaction(async (prisma) => {
      const productResult = await prisma.$queryRaw<{ id: string }[]>`
        INSERT INTO "Product" ("id", "name", "description")
        VALUES (gen_random_uuid(), ${category}, ${description || null}))
        RETURNING "id";
      `;

      const productId = productResult[0].id;

      const partInsertValues = partsForCustomizations
        .map((part) => `(${productId}, gen_random_uuid(), ${part.category})`)
        .join(", ");

      await prisma.$executeRawUnsafe(`
        INSERT INTO "Part" ("productId", "id", "category")
        VALUES ${partInsertValues};
      `);

      return {
        productId,
      };
    });
  }
}
