var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/ProductImage.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product.js";
let ProductImage = class ProductImage {
    id;
    productId;
    product;
    url;
    altText;
    sortOrder;
    isPrimary;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], ProductImage.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "product_id" }),
    __metadata("design:type", String)
], ProductImage.prototype, "productId", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product)
], ProductImage.prototype, "product", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], ProductImage.prototype, "url", void 0);
__decorate([
    Column("varchar", { name: "alt_text", nullable: true }),
    __metadata("design:type", String)
], ProductImage.prototype, "altText", void 0);
__decorate([
    Column("int", { name: "sort_order", default: 0 }),
    __metadata("design:type", Number)
], ProductImage.prototype, "sortOrder", void 0);
__decorate([
    Column("boolean", { name: "is_primary", default: false }),
    __metadata("design:type", Boolean)
], ProductImage.prototype, "isPrimary", void 0);
ProductImage = __decorate([
    Entity('product_images')
], ProductImage);
export { ProductImage };
