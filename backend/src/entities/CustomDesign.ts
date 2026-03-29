// src/entities/CustomDesign.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  OneToMany 
} from "typeorm";
import { User } from "./User.js";
import { CartItemDesign } from "./CartItemDesign.js";
import { OrderItemDesign } from "./OrderItemDesign.js";

@Entity('custom_designs')
export class CustomDesign {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "user_id", nullable: true })
  userId!: string;

  @ManyToOne(() => User, (user) => user.designs, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("varchar", { nullable: true })
  name!: string;

  @Column("varchar", { name: "file_url" })
  fileUrl!: string;

  @Column("varchar", { name: "thumbnail_url", nullable: true })
  thumbnailUrl!: string;

  @Column("varchar", { name: "file_type" })
  fileType!: string;

  @Column("int", { name: "file_size_kb" })
  fileSizeKb!: number;

  @Column("boolean", { name: "is_public", default: false })
  isPublic!: boolean;

  @Column("boolean", { name: "is_approved", default: false })
  isApproved!: boolean;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  price!: number | string;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => CartItemDesign, (cid) => cid.design)
  cartItemDesigns: CartItemDesign[];

  @OneToMany(() => OrderItemDesign, (oid) => oid.design)
  orderItemDesigns: OrderItemDesign[];
}
