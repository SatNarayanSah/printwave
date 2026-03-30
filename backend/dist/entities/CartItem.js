var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/CartItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Cart } from "./Cart.js";
import { Product } from "./Product.js";
import { ProductVariant } from "./ProductVariant.js";
import { CartItemDesign } from "./CartItemDesign.js";
let CartItem = class CartItem {
    id;
    cartId;
    cart;
    productId;
    product;
    variantId;
    variant;
    quantity;
    unitPrice;
    notes;
    designs;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], CartItem.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "cart_id" }),
    __metadata("design:type", String)
], CartItem.prototype, "cartId", void 0);
__decorate([
    ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "cart_id" }),
    __metadata("design:type", Cart)
], CartItem.prototype, "cart", void 0);
__decorate([
    Column("uuid", { name: "product_id" }),
    __metadata("design:type", String)
], CartItem.prototype, "productId", void 0);
__decorate([
    ManyToOne(() => Product),
    JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product)
], CartItem.prototype, "product", void 0);
__decorate([
    Column("uuid", { name: "variant_id" }),
    __metadata("design:type", String)
], CartItem.prototype, "variantId", void 0);
__decorate([
    ManyToOne(() => ProductVariant),
    JoinColumn({ name: "variant_id" }),
    __metadata("design:type", ProductVariant)
], CartItem.prototype, "variant", void 0);
__decorate([
    Column("int", { default: 1 }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    Column("decimal", { name: "unit_price", precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], CartItem.prototype, "unitPrice", void 0);
__decorate([
    Column("text", { nullable: true }),
    __metadata("design:type", String)
], CartItem.prototype, "notes", void 0);
__decorate([
    OneToMany(() => CartItemDesign, (design) => design.cartItem),
    __metadata("design:type", Array)
], CartItem.prototype, "designs", void 0);
CartItem = __decorate([
    Entity('cart_items')
], CartItem);
export { CartItem };
