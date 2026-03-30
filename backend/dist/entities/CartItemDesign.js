var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/CartItemDesign.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CartItem } from "./CartItem.js";
import { CustomDesign } from "./CustomDesign.js";
let CartItemDesign = class CartItemDesign {
    id;
    cartItemId;
    cartItem;
    designId;
    design;
    areaName; // "Front", "Back"
    positionX;
    positionY;
    scalePercent;
    rotation;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], CartItemDesign.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "cart_item_id" }),
    __metadata("design:type", String)
], CartItemDesign.prototype, "cartItemId", void 0);
__decorate([
    ManyToOne(() => CartItem, (item) => item.designs, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "cart_item_id" }),
    __metadata("design:type", CartItem)
], CartItemDesign.prototype, "cartItem", void 0);
__decorate([
    Column("uuid", { name: "design_id" }),
    __metadata("design:type", String)
], CartItemDesign.prototype, "designId", void 0);
__decorate([
    ManyToOne(() => CustomDesign),
    JoinColumn({ name: "design_id" }),
    __metadata("design:type", CustomDesign)
], CartItemDesign.prototype, "design", void 0);
__decorate([
    Column("varchar", { name: "area_name" }),
    __metadata("design:type", String)
], CartItemDesign.prototype, "areaName", void 0);
__decorate([
    Column("float", { name: "position_x" }),
    __metadata("design:type", Number)
], CartItemDesign.prototype, "positionX", void 0);
__decorate([
    Column("float", { name: "position_y" }),
    __metadata("design:type", Number)
], CartItemDesign.prototype, "positionY", void 0);
__decorate([
    Column("int", { name: "scale_percent", default: 100 }),
    __metadata("design:type", Number)
], CartItemDesign.prototype, "scalePercent", void 0);
__decorate([
    Column("int", { default: 0 }),
    __metadata("design:type", Number)
], CartItemDesign.prototype, "rotation", void 0);
CartItemDesign = __decorate([
    Entity('cart_item_designs')
], CartItemDesign);
export { CartItemDesign };
