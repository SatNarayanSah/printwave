var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Coupon.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from "typeorm";
import { CouponType } from "../types/enums.js";
let Coupon = class Coupon {
    id;
    code;
    type;
    value; // % or fixed NPR
    minOrderAmount;
    maxUses;
    usedCount;
    isActive;
    expiresAt;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Coupon.prototype, "id", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    Column({ type: "enum", enum: CouponType }),
    __metadata("design:type", String)
], Coupon.prototype, "type", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Coupon.prototype, "value", void 0);
__decorate([
    Column("decimal", { name: "min_order_amount", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Coupon.prototype, "minOrderAmount", void 0);
__decorate([
    Column("int", { name: "max_uses", nullable: true }),
    __metadata("design:type", Object)
], Coupon.prototype, "maxUses", void 0);
__decorate([
    Column("int", { name: "used_count", default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "usedCount", void 0);
__decorate([
    Column("boolean", { name: "is_active", default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isActive", void 0);
__decorate([
    Column("timestamp", { name: "expires_at", nullable: true }),
    __metadata("design:type", Object)
], Coupon.prototype, "expiresAt", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], Coupon.prototype, "createdAt", void 0);
Coupon = __decorate([
    Entity('coupons')
], Coupon);
export { Coupon };
