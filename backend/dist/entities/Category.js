var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Category.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product.js";
let Category = class Category {
    id;
    name;
    slug;
    description;
    imageUrl;
    isActive;
    sortOrder;
    products;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    Column("varchar", { name: "image_url", nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "imageUrl", void 0);
__decorate([
    Column("boolean", { name: "is_active", default: true }),
    __metadata("design:type", Boolean)
], Category.prototype, "isActive", void 0);
__decorate([
    Column("int", { name: "sort_order", default: 0 }),
    __metadata("design:type", Number)
], Category.prototype, "sortOrder", void 0);
__decorate([
    OneToMany(() => Product, (product) => product.category),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
Category = __decorate([
    Entity('categories')
], Category);
export { Category };
