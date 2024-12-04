import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./orders.service";
import express from "express";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "@/common/guards/RolesGuard";

@Controller("orders")
@UseGuards(AuthGuard("jwt")) // Protect all routes with JWT authentication
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  // Create a new order
  @Post()
  async createOrder(
    @Req() req: express.Request // Extract customerId from JWT
  ) {
    const customerId = req.user["id"]; // Get customerId from JWT
    const cart = this.ordersService.getCartFromUserId(customerId);
    return await this.ordersService.createOrder({
      customerId,
      cart: cart,
    });
  }

  // Get all orders for the authenticated customer
  @Get()
  async getOrdersForCustomer(@Req() req: express.Request) {
    const customerId = req.user["id"]; // Get customerId from JWT
    return await this.ordersService.getOrdersByCustomer(customerId);
  }

  // Get details of a specific order
  @Get("/:id")
  async getOrderById(
    @Param("id") orderId: string,
    @Req() req: express.Request
  ) {
    const customerId = req.user["id"]; // Get customerId from JWT
    return await this.ordersService.getOrderById(orderId, customerId);
  }

  @UseGuards(new RolesGuard(["ADMIN"]))
  @Patch("/:id/status")
  async updateOrderStatus(
    @Param("id") orderId: string,
    @Body() updateStatusDto: { status: string },
    @Req() req: express.Request
  ) {
    const customerId = req.user["id"]; // Get customerId from JWT
    return await this.ordersService.updateOrderStatus(
      orderId,
      customerId,
      updateStatusDto.status
    );
  }

  @UseGuards(new RolesGuard(["ADMIN"]))
  @Delete("/:id")
  async deleteOrder(@Param("id") orderId: string, @Req() req: express.Request) {
    const customerId = req.user["id"]; // Get customerId from JWT
    return await this.ordersService.deleteOrder(orderId, customerId);
  }
}
