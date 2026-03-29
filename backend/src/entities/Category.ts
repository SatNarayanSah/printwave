// src/entities/Category.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product.js";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { unique: true })
  name!: string;

  @Column("varchar", { unique: true })
  slug!: string;

  @Column("text", { nullable: true })
  description!: string;

  @Column("varchar", { name: "image_url", nullable: true })
  imageUrl!: string;

  @Column("boolean", { name: "is_active", default: true })
  isActive!: boolean;

  @Column("int", { name: "sort_order", default: 0 })
  sortOrder!: number;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
