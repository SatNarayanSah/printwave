var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/OrderItemDesign.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./OrderItem.js";
import { CustomDesign } from "./CustomDesign.js";
let OrderItemDesign = class OrderItemDesign {
    id;
    orderItemId;
    orderItem;
    designId;
    design;
    areaName;
    snapshotUrl; // Frozen at order time
    positionX;
    positionY;
    scalePercent;
    rotation;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], OrderItemDesign.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "order_item_id" }),
    __metadata("design:type", String)
], OrderItemDesign.prototype, "orderItemId", void 0);
__decorate([
    ManyToOne(() => OrderItem, (item) => item.designs, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "order_item_id" }),
    __metadata("design:type", OrderItem)
], OrderItemDesign.prototype, "orderItem", void 0);
__decorate([
    Column("uuid", { name: "design_id" }),
    __metadata("design:type", String)
], OrderItemDesign.prototype, "designId", void 0);
__decorate([
    ManyToOne(() => CustomDesign),
    JoinColumn({ name: "design_id" }),
    __metadata("design:type", CustomDesign)
], OrderItemDesign.prototype, "design", void 0);
__decorate([
    Column("varchar", { name: "area_name" }),
    __metadata("design:type", String)
], OrderItemDesign.prototype, "areaName", void 0);
__decorate([
    Column("varchar", { name: "snapshot_url" }),
    __metadata("design:type", String)
], OrderItemDesign.prototype, "snapshotUrl", void 0);
__decorate([
    Column("float", { name: "position_x" }),
    __metadata("design:type", Number)
], OrderItemDesign.prototype, "positionX", void 0);
__decorate([
    Column("float", { name: "position_y" }),
    __metadata("design:type", Number)
], OrderItemDesign.prototype, "positionY", void 0);
__decorate([
    Column("int", { name: "scale_percent" }),
    __metadata("design:type", Number)
], OrderItemDesign.prototype, "scalePercent", void 0);
__decorate([
    Column("int"),
    __metadata("design:type", Number)
], OrderItemDesign.prototype, "rotation", void 0);
OrderItemDesign = __decorate([
    Entity('order_item_designs')
], OrderItemDesign);
export { OrderItemDesign };
