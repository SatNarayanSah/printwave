// src/entities/User.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany, 
  OneToOne 
} from "typeorm";
import { UserRole } from "../types/enums.js";
import { Address } from "./Address.js";
import { Order } from "./Order.js";
import { Cart } from "./Cart.js";
import { Review } from "./Review.js";
import { RefreshToken } from "./RefreshToken.js";
import { CustomDesign } from "./CustomDesign.js";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("varchar", { unique: true, nullable: true })
  phone!: string | null;

  @Column("varchar", { name: 'password_hash' })
  passwordHash!: string;

  @Column("varchar", { name: 'first_name' })
  firstName!: string;

  @Column("varchar", { name: 'last_name' })
  lastName!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role!: UserRole;

  @Column("boolean", { name: 'is_verified', default: false })
  isVerified!: boolean;

  @Column("varchar", { name: 'email_verification_token', nullable: true })
  emailVerificationToken!: string | null;

  @Column("timestamp", { name: 'email_verification_expiry', nullable: true })
  emailVerificationExpiry!: Date | null;

  @Column("boolean", { name: 'is_active', default: true })
  isActive!: boolean;

  @Column("varchar", { name: 'avatar_url', nullable: true })
  avatarUrl!: string | null;

  @CreateDateColumn({ type: "timestamp", name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses!: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart;

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => CustomDesign, (design) => design.user)
  designs!: CustomDesign[];
}
