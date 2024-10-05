import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import cloudinary from 'src/cloudinary.config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createProduct(
    name: string,
    description: string,
    price: number,
    image: Express.Multer.File,
  ): Promise<Product> {
    const uploadResult = await cloudinary.uploader.upload(image.path);

    const newProduct = new this.productModel({
      name,
      description,
      price,
      imageUrl: uploadResult.secure_url,
    });

    return newProduct.save();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async getProductById(productId: string): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
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

    return product.save();
  }

  async deleteProduct(productId: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: productId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }
}
