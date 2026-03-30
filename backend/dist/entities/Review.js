var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/Review.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./User.js";
import { Product } from "./Product.js";
let Review = class Review {
    id;
    userId;
    user;
    productId;
    product;
    rating; // 1–5
    title;
    body;
    imageUrl;
    isVisible;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "user_id" }),
    __metadata("design:type", String)
], Review.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.reviews),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", User)
], Review.prototype, "user", void 0);
__decorate([
    Column("uuid", { name: "product_id" }),
    __metadata("design:type", String)
], Review.prototype, "productId", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.reviews),
    JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product)
], Review.prototype, "product", void 0);
__decorate([
    Column("int"),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "title", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "body", void 0);
__decorate([
    Column("varchar", { name: "image_url", nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "imageUrl", void 0);
__decorate([
    Column("boolean", { name: "is_visible", default: true }),
    __metadata("design:type", Boolean)
], Review.prototype, "isVisible", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
Review = __decorate([
    Entity('reviews'),
    Unique(['userId', 'productId'])
], Review);
export { Review };
