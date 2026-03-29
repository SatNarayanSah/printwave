// src/entities/Product.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from "typeorm";
import { Category } from "./Category.js";
import { ProductVariant } from "./ProductVariant.js";
import { ProductImage } from "./ProductImage.js";
import { Review } from "./Review.js";
import { DesignArea } from "./DesignArea.js";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar", { unique: true })
  slug!: string;

  @Column("text", { nullable: true })
  description!: string;

  @Column("uuid", { name: "category_id" })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @Column("decimal", { name: "base_price", precision: 10, scale: 2 })
  basePrice!: number | string;

  @Column("varchar")
  fabric!: string;

  @Column("int")
  gsm!: number;

  @Column("boolean", { name: "is_customizable", default: true })
  isCustomizable!: boolean;

  @Column("boolean", { name: "is_active", default: true })
  isActive!: boolean;

  @Column("boolean", { name: "is_featured", default: false })
  isFeatured!: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants!: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images!: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];

  @OneToMany(() => DesignArea, (area) => area.product)
  designAreas!: DesignArea[];
}
