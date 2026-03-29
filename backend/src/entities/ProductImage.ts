// src/entities/ProductImage.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product.js";

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "product_id" })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column("varchar")
  url!: string;

  @Column("varchar", { name: "alt_text", nullable: true })
  altText!: string;

  @Column("int", { name: "sort_order", default: 0 })
  sortOrder!: number;

  @Column("boolean", { name: "is_primary", default: false })
  isPrimary!: boolean;
}
