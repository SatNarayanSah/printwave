// src/entities/OrderItem.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from "typeorm";
import { Order } from "./Order.js";
import { Product } from "./Product.js";
import { ProductVariant } from "./ProductVariant.js";
import { OrderItemDesign } from "./OrderItemDesign.js";

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "order_id" })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "order_id" })
  order!: Order;

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

  @Column("int")
  quantity!: number;

  @Column("decimal", { name: "unit_price", precision: 10, scale: 2 })
  unitPrice!: number | string;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number | string;

  @OneToMany(() => OrderItemDesign, (design) => design.orderItem)
  designs!: OrderItemDesign[];
}
