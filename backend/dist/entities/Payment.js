var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Payment.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./Order.js";
import { PaymentStatus } from "../types/enums.js";
let Payment = class Payment {
    id;
    orderId;
    order;
    gateway;
    amount;
    currency;
    gatewayRef;
    status;
    rawResponse;
    paidAt;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "order_id", unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "orderId", void 0);
__decorate([
    OneToOne(() => Order, (order) => order.payment),
    JoinColumn({ name: "order_id" }),
    __metadata("design:type", Order)
], Payment.prototype, "order", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Payment.prototype, "gateway", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Payment.prototype, "amount", void 0);
__decorate([
    Column("varchar", { default: "NPR" }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    Column("varchar", { name: "gateway_ref", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "gatewayRef", void 0);
__decorate([
    Column({ type: "enum", enum: PaymentStatus }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    Column({ type: "jsonb", name: "raw_response", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "rawResponse", void 0);
__decorate([
    Column({ name: "paid_at", type: "timestamp", nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "paidAt", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
Payment = __decorate([
    Entity('payments')
], Payment);
export { Payment };
