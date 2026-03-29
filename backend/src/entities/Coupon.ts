// src/entities/Coupon.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
} from "typeorm";
import { CouponType } from "../types/enums.js";

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { unique: true })
  code!: string;

  @Column({ type: "enum", enum: CouponType })
  type!: CouponType;

  @Column("decimal", { precision: 10, scale: 2 })
  value!: number | string; // % or fixed NPR

  @Column("decimal", { name: "min_order_amount", precision: 10, scale: 2, nullable: true })
  minOrderAmount!: number | string | null;

  @Column("int", { name: "max_uses", nullable: true })
  maxUses!: number | null;

  @Column("int", { name: "used_count", default: 0 })
  usedCount!: number;

  @Column("boolean", { name: "is_active", default: true })
  isActive!: boolean;

  @Column("timestamp", { name: "expires_at", nullable: true })
  expiresAt!: Date | null;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;
}
