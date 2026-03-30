var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Category } from "./Category.js";
import { ProductVariant } from "./ProductVariant.js";
import { ProductImage } from "./ProductImage.js";
import { Review } from "./Review.js";
import { DesignArea } from "./DesignArea.js";
let Product = class Product {
    id;
    name;
    slug;
    description;
    categoryId;
    category;
    basePrice;
    fabric;
    gsm;
    isCustomizable;
    isActive;
    isFeatured;
    createdAt;
    updatedAt;
    variants;
    images;
    reviews;
    designAreas;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Column("uuid", { name: "category_id" }),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    ManyToOne(() => Category, (category) => category.products),
    JoinColumn({ name: "category_id" }),
    __metadata("design:type", Category)
], Product.prototype, "category", void 0);
__decorate([
    Column("decimal", { name: "base_price", precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Product.prototype, "basePrice", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Product.prototype, "fabric", void 0);
__decorate([
    Column("int"),
    __metadata("design:type", Number)
], Product.prototype, "gsm", void 0);
__decorate([
    Column("boolean", { name: "is_customizable", default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isCustomizable", void 0);
__decorate([
    Column("boolean", { name: "is_active", default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    Column("boolean", { name: "is_featured", default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp", name: "updated_at" }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => ProductVariant, (variant) => variant.product),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    OneToMany(() => ProductImage, (image) => image.product),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    OneToMany(() => Review, (review) => review.product),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
__decorate([
    OneToMany(() => DesignArea, (area) => area.product),
    __metadata("design:type", Array)
], Product.prototype, "designAreas", void 0);
Product = __decorate([
    Entity('products')
], Product);
export { Product };
