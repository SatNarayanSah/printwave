// src/entities/OrderStatusHistory.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order.js";
import { OrderStatus } from "../types/enums.js";

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "order_id" })
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.statusHistory)
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column({ type: "enum", enum: OrderStatus })
  status!: OrderStatus;

  @Column("text", { nullable: true })
  note!: string;

  @Column("varchar", { name: "created_by", nullable: true })
  createdBy!: string; // admin userId or "system"

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;
}
