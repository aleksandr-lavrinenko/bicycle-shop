import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import express from "express";
import { OptionalJwtAuthGuard } from "@/common/guards/OptionalJwtAuthGuard";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get the contents of the cart (Authenticated user)
  @UseGuards(OptionalJwtAuthGuard)
  @Get("/")
  async getCartContent(@Req() req: express.Request) {
    const userId = req.user["id"];
    const sessionId = req.cookies["sessionId"];

    return await this.cartService.getCartContentByUser(userId, sessionId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post("/product")
  async addProductToCart(
    @Req() req: Request,
    @Body() addProductDto: { productId: string; selectedItemsIds: string[] }
  ) {
    const userId = req.user?.id || null;
    const sessionId = req.cookies["sessionId"];

    return await this.cartService.addProductToCart({
      userId,
      sessionId,
      productId: addProductDto.productId,
      selectedItemsIds: addProductDto.selectedItemsIds,
    });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch("/product")
  async updateProductInCart(
    @Req() req: Request,
    @Body() addProductDto: { productId: string; selectedItemsIds: string[] }
  ) {
    const userId = req.user?.id || null;
    const sessionId = req.cookies["sessionId"];

    return await this.cartService.updateProductToCart({
      userId,
      sessionId,
      productId: addProductDto.productId,
      selectedItemsIds: addProductDto.selectedItemsIds,
    });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete("/product/:productCartId")
  async removeProductFromCart(
    @Req() req: express.Request,
    @Param("productCartId") productCartId: string
  ) {
    const userId = req.user["id"];
    const sessionId = req.cookies["sessionId"];
    return await this.cartService.removeProductFromCart(
      userId,
      sessionId,
      productCartId
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete("/")
  async clearCart(@Req() req: express.Request) {
    const userId = req.user["id"];
    const sessionId = req.cookies["sessionId"];

    return await this.cartService.clearCart(userId, sessionId);
  }
}
