var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/OrderStatusHistory.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order.js";
import { OrderStatus } from "../types/enums.js";
let OrderStatusHistory = class OrderStatusHistory {
    id;
    orderId;
    order;
    status;
    note;
    createdBy; // admin userId or "system"
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "order_id" }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "orderId", void 0);
__decorate([
    ManyToOne(() => Order, (order) => order.statusHistory),
    JoinColumn({ name: "order_id" }),
    __metadata("design:type", Order)
], OrderStatusHistory.prototype, "order", void 0);
__decorate([
    Column({ type: "enum", enum: OrderStatus }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "status", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "note", void 0);
__decorate([
    Column("varchar", { name: "created_by", nullable: true }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "createdBy", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], OrderStatusHistory.prototype, "createdAt", void 0);
OrderStatusHistory = __decorate([
    Entity('order_status_history')
], OrderStatusHistory);
export { OrderStatusHistory };
