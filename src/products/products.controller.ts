import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IpWhitelistGuard } from 'src/ip-whitelist/ip-whitelist.guard';
import { IpWhitelistInterceptor } from 'src/ip-whitelist/ip-whitelist.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  // @UseGuards(IpWhitelistGuard)
  @UseInterceptors(IpWhitelistInterceptor)
  async createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.createProduct(name, description, price, image);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') productId: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.updateProduct(
      productId,
      name,
      description,
      price,
      image,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
