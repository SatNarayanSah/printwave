var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { UserRole } from "../types/enums.js";
import { Address } from "./Address.js";
import { Order } from "./Order.js";
import { Cart } from "./Cart.js";
import { Review } from "./Review.js";
import { RefreshToken } from "./RefreshToken.js";
import { CustomDesign } from "./CustomDesign.js";
let User = class User {
    id;
    email;
    phone;
    passwordHash;
    firstName;
    lastName;
    role;
    isVerified;
    emailVerificationToken;
    emailVerificationExpiry;
    passwordResetTokenHash;
    passwordResetExpiry;
    isActive;
    avatarUrl;
    createdAt;
    updatedAt;
    addresses;
    orders;
    cart;
    reviews;
    refreshTokens;
    designs;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column("varchar", { unique: true, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    Column("varchar", { name: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    Column("varchar", { name: 'first_name' }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Column("varchar", { name: 'last_name' }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CUSTOMER
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column("boolean", { name: 'is_verified', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    Column("varchar", { name: 'email_verification_token', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    Column("timestamp", { name: 'email_verification_expiry', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "emailVerificationExpiry", void 0);
__decorate([
    Column("varchar", { name: 'password_reset_token_hash', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetTokenHash", void 0);
__decorate([
    Column("timestamp", { name: 'password_reset_expiry', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetExpiry", void 0);
__decorate([
    Column("boolean", { name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    Column("varchar", { name: 'avatar_url', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "avatarUrl", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp", name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => Address, (address) => address.user),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
__decorate([
    OneToMany(() => Order, (order) => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    OneToOne(() => Cart, (cart) => cart.user),
    __metadata("design:type", Cart)
], User.prototype, "cart", void 0);
__decorate([
    OneToMany(() => Review, (review) => review.user),
    __metadata("design:type", Array)
], User.prototype, "reviews", void 0);
__decorate([
    OneToMany(() => RefreshToken, (token) => token.user),
    __metadata("design:type", Array)
], User.prototype, "refreshTokens", void 0);
__decorate([
    OneToMany(() => CustomDesign, (design) => design.user),
    __metadata("design:type", Array)
], User.prototype, "designs", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
