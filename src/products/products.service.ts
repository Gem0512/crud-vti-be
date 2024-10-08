import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import cloudinary from 'src/cloudinary.config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(
    name: string,
    description: string,
    price: number,
    image: Express.Multer.File,
  ): Promise<Product> {
    const uploadResult = await cloudinary.uploader.upload(image.path);

    const newProduct = this.productRepository.create({
      name,
      description,
      price,
      imageUrl: uploadResult.secure_url,
    });

    return this.productRepository.save(newProduct);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(productId: string): Promise<Product> {
    const id = parseInt(productId, 10); // Chuyển đổi từ chuỗi sang số
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }

  async updateProduct(
    productId: string,
    name: string,
    description: string,
    price: number,
    image?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.getProductById(productId);

    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image.path);
      product.imageUrl = uploadResult.secure_url;
    }

    product.name = name;
    product.description = description;
    product.price = price;

    return this.productRepository.save(product);
  }

  async deleteProduct(productId: string): Promise<void> {
    const result = await this.productRepository.delete(productId);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }
}
