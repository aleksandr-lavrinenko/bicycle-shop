import { Injectable } from "@nestjs/common";
import { PartsRepository } from "./parts.repository";

@Injectable()
export class PartsService {
  constructor(private readonly partsRepository: PartsRepository) {}

  async getPartsWithPrices(parts: string[]) {
    return await this.partsRepository.getPartsWithPrices(parts);
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
    return this.partsRepository.listParts(productId, { startId, limit });
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
    return this.partsRepository.listPartOptions(partId, selectedParts, {
      startId,
      limit,
    });
  }

  async addNewPart(
    productId: string,
    createPartDto: {
      name: string;
      description?: string;
      price: string;
      priceAdjustmentsRules: object[];
      stock: number;
    }
  ) {
    return this.partsRepository.addPart(productId, createPartDto);
  }
}
