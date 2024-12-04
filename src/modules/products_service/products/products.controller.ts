import {
  Controller,
  Patch,
  Param,
  Body,
  Get,
  Query,
  UseGuards,
  Delete,
  Post,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "@/common/guards/RolesGuard";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public get opertations

  // Get list of avaiable products. For now should return only bicycles
  @Get("list")
  async listProducts(
    @Query("category") category: string | undefined = undefined // Optional: Filter by category
  ) {
    return await this.productsService.listProducts({
      category,
    });
  }

  // Admin managment
  @Post()
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async createProduct(
    @Body()
    createProductDto: {
      category: string;
      description?: string;
      partsForCustomizations: { category: string }[];
    }
  ) {
    return await this.productsService.createProduct(createProductDto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: unknown
  ) {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async deleteProduct(@Param("id") id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
