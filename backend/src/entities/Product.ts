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

export enum ProductType {
  APPAREL = "apparel",      // T-shirt, kurta, pants, saree, hoodie, etc.
  DRINKWARE = "drinkware",  // Mug, tumbler, bottle
  ACCESSORY = "accessory",  // Phone case, bag, cap, etc.
  HOME = "home",            // Cushion, poster, etc.
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar", { unique: true })
  slug!: string;

  @Column("text", { nullable: true })
  description!: string | null;

  @Column({ type: "enum", enum: ProductType, nullable: true, default: ProductType.APPAREL })
  productType!: ProductType | null;                    // ← NEW: Critical for your platform

  @Column("uuid", { name: "category_id" })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @Column("decimal", { name: "base_price", precision: 10, scale: 2 })
  basePrice!: number;

  @Column("varchar", { nullable: true })
  material!: string | null;           // ← Changed from fabric (Cotton, Ceramic, Polyester, etc.)

  @Column("int", { nullable: true })
  gsm!: number | null;         // ← Only for apparel (nullable)

  @Column("decimal", { name: "weight_grams", precision: 8, scale: 2, nullable: true })
  weightGrams!: number | null; // ← NEW: Required for shipping

  @Column("boolean", { name: "is_customizable", default: true })
  isCustomizable!: boolean;

  @Column("boolean", { name: "is_active", default: true })
  isActive!: boolean;

  @Column("boolean", { name: "is_featured", default: false })
  isFeatured!: boolean;

  @Column("varchar", { name: "print_technique", nullable: true })
  printTechnique!: string | null; // DTG, DTF, Sublimation, Embroidery, etc.

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;

  // SEO
  @Column("varchar", { name: "meta_title", nullable: true })
  metaTitle!: string | null;

  @Column("text", { name: "meta_description", nullable: true })
  metaDescription!: string | null;

  @Column("simple-array", { nullable: true })
  tags!: string[] | null;   // e.g. ["premium", "oversized", "summer-collection"]

  // Relations
  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants!: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images!: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];

  @OneToMany(() => DesignArea, (area) => area.product, { cascade: true })
  designAreas!: DesignArea[];
}
