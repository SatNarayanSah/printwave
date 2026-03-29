// src/entities/ProductVariant.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from "typeorm";
import { Product } from "./Product.js";
import { ShirtSize } from "../types/enums.js";

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "product_id" })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: "enum", enum: ShirtSize })
  size!: ShirtSize;

  @Column("varchar")
  color!: string;

  @Column("varchar", { name: "color_hex" })
  colorHex!: string;

  @Column("varchar", { unique: true })
  sku!: string;

  @Column("int", { default: 0 })
  stock!: number;

  @Column("decimal", { name: "price_adj", precision: 10, scale: 2, default: 0 })
  priceAdj!: number | string;

  @Column("varchar", { name: "image_url", nullable: true })
  imageUrl!: string;
}
