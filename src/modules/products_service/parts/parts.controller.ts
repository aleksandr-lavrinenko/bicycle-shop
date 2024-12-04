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
import { PartsService } from "./parts.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "@/common/guards/RolesGuard";

@Controller("parts")
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  // Public get opertations

  // Return all possible customizable elements for the selected product
  @Get(":id/parts")
  async listParts(
    @Param("id") productId: string,
    @Query("startId") startId?: string,
    @Query("limit") limit: number = 10
  ) {
    return await this.partsService.listParts(productId, { startId, limit });
  }

  // Return all possible options for element based on already selected components
  @Get(":id/parts/:partId/options")
  async listPartOptions(
    @Param("id") productId: string,
    @Param("partId") partId: string,
    @Query("selectedParts") selectedParts: string[],
    @Query("startId") startId?: string,
    @Query("limit") limit: number = 10
  ) {
    return await this.partsService.listPartOptions(partId, selectedParts, {
      startId,
      limit,
    });
  }

  // Admin managment

  @Post(":id/parts")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async addNewPart(
    @Param("id") productId: string,
    @Body()
    createPartDto: {
      name: string;
      description?: string;
      price: string;
      priceAdjustmentsRules: object[];
      stock: number;
    }
  ) {
    return await this.partsService.addNewPart(productId, createPartDto);
  }

  @Patch(":id/parts/:partId")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async updatePart(
    @Param("id") productId: string,
    @Param("partId") partId: string,
    @Body()
    updatePartDto: unknown
  ) {
    return await this.partsService.updatePart(productId, partId, updatePartDto);
  }

  @Delete(":id/parts/:partId")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async deletePart(
    @Param("id") productId: string,
    @Param("partId") partId: string
  ) {
    return await this.partsService.deletePart(productId, partId);
  }

  @Post(":id/parts/:partId/options")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async addPartOption(
    @Param("id") productId: string,
    @Param("partId") partId: string,
    @Body() createPartOptionDto: unknown
  ) {
    return await this.partsService.addPartOption(
      productId,
      partId,
      createPartOptionDto
    );
  }

  @Patch(":id/parts/:partId/options/:optionId")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async updatePartOption(
    @Param("id") productId: string,
    @Param("partId") partId: string,
    @Param("optionId") optionId: string,
    @Body()
    updatePartOptionDto: {
      name: string;
      description?: string;
      price: number;
      stock: number;
      customPriceRules: object[];
    }
  ) {
    return await this.partsService.updatePartOption(
      productId,
      optionId,
      updatePartOptionDto
    );
  }

  @Delete(":id/parts/:partId/options/:optionId")
  @UseGuards(AuthGuard("jwt"), new RolesGuard(["ADMIN"]))
  async deletePartOption(
    @Param("id") productId: string,
    @Param("partId") partId: string,
    @Param("optionId") optionId: string
  ) {
    return await this.partsService.deletePartOption(
      productId,
      partId,
      optionId
    );
  }
}
