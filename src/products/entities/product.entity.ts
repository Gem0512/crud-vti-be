import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ProductDocument = Product & Document;
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  des: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
