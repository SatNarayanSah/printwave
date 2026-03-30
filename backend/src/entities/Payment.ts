// src/entities/Payment.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  OneToOne, 
  JoinColumn 
} from "typeorm";
import { Order } from "./Order.js";
import { PaymentStatus } from "../types/enums.js";

export type PaymentGateway = "esewa" | "khalti" | "cod";

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "order_id", unique: true })
  orderId!: string;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column("varchar")
  gateway!: PaymentGateway;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number | string;

  @Column("varchar", { default: "NPR" })
  currency!: string;

  @Column("varchar", { name: "gateway_ref", nullable: true })
  gatewayRef!: string | null;

  @Column({ type: "enum", enum: PaymentStatus })
  status!: PaymentStatus;

  @Column({ type: "jsonb", name: "raw_response", nullable: true })
  rawResponse!: unknown | null;

  @Column({ name: "paid_at", type: "timestamp", nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;
}
