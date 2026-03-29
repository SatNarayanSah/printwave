// src/entities/Review.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  Unique 
} from "typeorm";
import { User } from "./User.js";
import { Product } from "./Product.js";

@Entity('reviews')
@Unique(['userId', 'productId'])
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("uuid", { name: "product_id" })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column("int")
  rating!: number; // 1–5

  @Column("varchar", { nullable: true })
  title!: string;

  @Column("text", { nullable: true })
  body!: string;

  @Column("varchar", { name: "image_url", nullable: true })
  imageUrl!: string;

  @Column("boolean", { name: "is_visible", default: true })
  isVisible!: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;
}
