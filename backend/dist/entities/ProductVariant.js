var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/ProductVariant.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product.js";
let ProductVariant = class ProductVariant {
    id;
    productId;
    product;
    size;
    color;
    colorHex;
    sku;
    stock;
    priceAdj;
    imageUrl;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "product_id" }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], ProductVariant.prototype, "size", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], ProductVariant.prototype, "color", void 0);
__decorate([
    Column("varchar", { name: "color_hex" }),
    __metadata("design:type", String)
], ProductVariant.prototype, "colorHex", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    Column("int", { default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stock", void 0);
__decorate([
    Column("decimal", { name: "price_adj", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "priceAdj", void 0);
__decorate([
    Column("text", { name: "image_url", nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "imageUrl", void 0);
ProductVariant = __decorate([
    Entity('product_variants')
], ProductVariant);
export { ProductVariant };
