// src/entities/Order.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany, 
  OneToOne, 
  JoinColumn 
} from "typeorm";
import { User } from "./User.js";
import { Address } from "./Address.js";
import { OrderStatus, PaymentStatus } from "../types/enums.js";
import { OrderItem } from "./OrderItem.js";
import { OrderStatusHistory } from "./OrderStatusHistory.js";
import { Payment } from "./Payment.js";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { name: "order_number", unique: true })
  orderNumber!: string;

  @Column("uuid", { name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("uuid", { name: "address_id", nullable: true })
  addressId!: string;

  @ManyToOne(() => Address, (address) => address.orders, { nullable: true })
  @JoinColumn({ name: "address_id" })
  address!: Address;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ name: "payment_status", type: "enum", enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus!: PaymentStatus;

  @Column("varchar", { name: "payment_method", nullable: true })
  paymentMethod!: string;

  @Column("varchar", { name: "payment_ref", nullable: true })
  paymentRef!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal!: number | string;

  @Column("decimal", { name: "discount_amount", precision: 10, scale: 2, default: 0 })
  discountAmount!: number | string;

  @Column("decimal", { name: "shipping_fee", precision: 10, scale: 2, default: 0 })
  shippingFee!: number | string;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number | string;

  @Column("varchar", { name: "coupon_code", nullable: true })
  couponCode!: string;

  @Column("text", { nullable: true })
  notes!: string;

  @Column("boolean", { name: "is_bulk_order", default: false })
  isBulkOrder!: boolean;

  @Column({ name: "expected_delivery", type: "timestamp", nullable: true })
  expectedDelivery!: Date;

  @Column({ name: "delivered_at", type: "timestamp", nullable: true })
  deliveredAt!: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistory!: OrderStatusHistory[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment!: Payment;
}
