// src/entities/CartItemDesign.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from "typeorm";
import { CartItem } from "./CartItem.js";
import { CustomDesign } from "./CustomDesign.js";

@Entity('cart_item_designs')
export class CartItemDesign {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "cart_item_id" })
  cartItemId!: string;

  @ManyToOne(() => CartItem, (item) => item.designs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "cart_item_id" })
  cartItem!: CartItem;

  @Column("uuid", { name: "design_id" })
  designId!: string;

  @ManyToOne(() => CustomDesign)
  @JoinColumn({ name: "design_id" })
  design!: CustomDesign;

  @Column("varchar", { name: "area_name" })
  areaName!: string; // "Front", "Back"

  @Column("float", { name: "position_x" })
  positionX!: number;

  @Column("float", { name: "position_y" })
  positionY!: number;

  @Column("int", { name: "scale_percent", default: 100 })
  scalePercent!: number;

  @Column("int", { default: 0 })
  rotation!: number;
}
