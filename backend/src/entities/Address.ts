import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User.js";
import { Order } from "./Order.js";

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("varchar")
  label!: string;

  @Column("varchar")
  street!: string;

  @Column("varchar")
  city!: string;

  @Column("varchar")
  district!: string;

  @Column("varchar")
  province!: string;

  @Column("boolean", { name: "is_default", default: false })
  isDefault!: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => Order, (order) => order.address)
  orders!: Order[];
}
