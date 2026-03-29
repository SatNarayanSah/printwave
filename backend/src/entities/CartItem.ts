// src/entities/CartItem.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from "typeorm";
import { Cart } from "./Cart.js";
import { Product } from "./Product.js";
import { ProductVariant } from "./ProductVariant.js";
import { CartItemDesign } from "./CartItemDesign.js";

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "cart_id" })
  cartId!: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "cart_id" })
  cart!: Cart;

  @Column("uuid", { name: "product_id" })
  productId!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column("uuid", { name: "variant_id" })
  variantId!: string;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant!: ProductVariant;

  @Column("int", { default: 1 })
  quantity!: number;

  @Column("decimal", { name: "unit_price", precision: 10, scale: 2 })
  unitPrice!: number | string;

  @Column("text", { nullable: true })
  notes!: string;

  @OneToMany(() => CartItemDesign, (design) => design.cartItem)
  designs!: CartItemDesign[];
}
