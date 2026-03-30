var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Order.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";
import { Address } from "./Address.js";
import { OrderStatus, PaymentStatus } from "../types/enums.js";
import { OrderItem } from "./OrderItem.js";
import { OrderStatusHistory } from "./OrderStatusHistory.js";
import { Payment } from "./Payment.js";
let Order = class Order {
    id;
    orderNumber;
    userId;
    user;
    addressId;
    address;
    status;
    paymentStatus;
    paymentMethod;
    paymentRef;
    subtotal;
    discountAmount;
    shippingFee;
    total;
    couponCode;
    notes;
    isBulkOrder;
    expectedDelivery;
    deliveredAt;
    createdAt;
    updatedAt;
    items;
    statusHistory;
    payment;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    Column("varchar", { name: "order_number", unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    Column("uuid", { name: "user_id" }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.orders),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", User)
], Order.prototype, "user", void 0);
__decorate([
    Column("uuid", { name: "address_id", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "addressId", void 0);
__decorate([
    ManyToOne(() => Address, (address) => address.orders, { nullable: true }),
    JoinColumn({ name: "address_id" }),
    __metadata("design:type", Address)
], Order.prototype, "address", void 0);
__decorate([
    Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    Column({ name: "payment_status", type: "enum", enum: PaymentStatus, default: PaymentStatus.UNPAID }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    Column("varchar", { name: "payment_method", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    Column("varchar", { name: "payment_ref", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentRef", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Order.prototype, "subtotal", void 0);
__decorate([
    Column("decimal", { name: "discount_amount", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Object)
], Order.prototype, "discountAmount", void 0);
__decorate([
    Column("decimal", { name: "shipping_fee", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Object)
], Order.prototype, "shippingFee", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Order.prototype, "total", void 0);
__decorate([
    Column("varchar", { name: "coupon_code", nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "couponCode", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    Column("boolean", { name: "is_bulk_order", default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isBulkOrder", void 0);
__decorate([
    Column({ name: "expected_delivery", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "expectedDelivery", void 0);
__decorate([
    Column({ name: "delivered_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "deliveredAt", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp", name: "updated_at" }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => OrderItem, (item) => item.order),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    OneToMany(() => OrderStatusHistory, (history) => history.order),
    __metadata("design:type", Array)
], Order.prototype, "statusHistory", void 0);
__decorate([
    OneToOne(() => Payment, (payment) => payment.order),
    __metadata("design:type", Payment)
], Order.prototype, "payment", void 0);
Order = __decorate([
    Entity('orders')
], Order);
export { Order };
