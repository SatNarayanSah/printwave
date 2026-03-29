// src/entities/OrderItemDesign.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from "typeorm";
import { OrderItem } from "./OrderItem.js";
import { CustomDesign } from "./CustomDesign.js";

@Entity('order_item_designs')
export class OrderItemDesign {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "order_item_id" })
  orderItemId!: string;

  @ManyToOne(() => OrderItem, (item) => item.designs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "order_item_id" })
  orderItem!: OrderItem;

  @Column("uuid", { name: "design_id" })
  designId!: string;

  @ManyToOne(() => CustomDesign)
  @JoinColumn({ name: "design_id" })
  design!: CustomDesign;

  @Column("varchar", { name: "area_name" })
  areaName!: string;

  @Column("varchar", { name: "snapshot_url" })
  snapshotUrl!: string; // Frozen at order time

  @Column("float", { name: "position_x" })
  positionX!: number;

  @Column("float", { name: "position_y" })
  positionY!: number;

  @Column("int", { name: "scale_percent" })
  scalePercent!: number;

  @Column("int")
  rotation!: number;
}
