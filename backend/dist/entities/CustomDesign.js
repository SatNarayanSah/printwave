var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/CustomDesign.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User.js";
import { CartItemDesign } from "./CartItemDesign.js";
import { OrderItemDesign } from "./OrderItemDesign.js";
let CustomDesign = class CustomDesign {
    id;
    userId;
    user;
    name;
    fileUrl;
    thumbnailUrl;
    fileType;
    fileSizeKb;
    isPublic;
    isApproved;
    price;
    createdAt;
    cartItemDesigns;
    orderItemDesigns;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], CustomDesign.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "user_id", nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.designs, { nullable: true }),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", User)
], CustomDesign.prototype, "user", void 0);
__decorate([
    Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "name", void 0);
__decorate([
    Column("varchar", { name: "file_url" }),
    __metadata("design:type", String)
], CustomDesign.prototype, "fileUrl", void 0);
__decorate([
    Column("varchar", { name: "thumbnail_url", nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "thumbnailUrl", void 0);
__decorate([
    Column("varchar", { name: "file_type" }),
    __metadata("design:type", String)
], CustomDesign.prototype, "fileType", void 0);
__decorate([
    Column("int", { name: "file_size_kb" }),
    __metadata("design:type", Number)
], CustomDesign.prototype, "fileSizeKb", void 0);
__decorate([
    Column("boolean", { name: "is_public", default: false }),
    __metadata("design:type", Boolean)
], CustomDesign.prototype, "isPublic", void 0);
__decorate([
    Column("boolean", { name: "is_approved", default: false }),
    __metadata("design:type", Boolean)
], CustomDesign.prototype, "isApproved", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], CustomDesign.prototype, "price", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], CustomDesign.prototype, "createdAt", void 0);
__decorate([
    OneToMany(() => CartItemDesign, (cid) => cid.design),
    __metadata("design:type", Array)
], CustomDesign.prototype, "cartItemDesigns", void 0);
__decorate([
    OneToMany(() => OrderItemDesign, (oid) => oid.design),
    __metadata("design:type", Array)
], CustomDesign.prototype, "orderItemDesigns", void 0);
CustomDesign = __decorate([
    Entity('custom_designs')
], CustomDesign);
export { CustomDesign };
