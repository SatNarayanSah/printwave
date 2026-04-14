// src/entities/DesignArea.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product.js";

@Entity('design_areas')
export class DesignArea {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "product_id" })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.designAreas)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column("varchar")
  name!: string; // "Front", "Back", "Left Sleeve"

  @Column("varchar", { name: "area_key", nullable: true })
  areaKey!: string | null;

  @Column("int", { name: "width_px" })
  widthPx!: number;

  @Column("int", { name: "height_px" })
  heightPx!: number;

  @Column("int", { name: "top_px" })
  topPx!: number; // offset from product image top

  @Column("int", { name: "left_px" })
  leftPx!: number; // offset from product image left

  @Column("simple-array", { name: "allowed_file_types", nullable: true })
  allowedFileTypes!: string[] | null;

  @Column("int", { name: "dpi_requirement", nullable: true })
  dpiRequirement!: number | null;

  @Column("int", { name: "sort_order", default: 0 })
  sortOrder!: number;

  @Column("boolean", { name: "is_required", default: false })
  isRequired!: boolean;
}
