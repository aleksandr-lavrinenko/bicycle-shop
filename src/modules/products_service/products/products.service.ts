import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listProducts({ category }: { category?: string }) {
    return this.productsRepository.list(category);
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
    return this.productsRepository.createProduct({
      category,
      description,
      partsForCustomizations,
    });
  }
}
