var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/DesignArea.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product.js";
let DesignArea = class DesignArea {
    id;
    productId;
    product;
    name; // "Front", "Back", "Left Sleeve"
    areaKey;
    widthPx;
    heightPx;
    topPx; // offset from product image top
    leftPx; // offset from product image left
    allowedFileTypes;
    dpiRequirement;
    sortOrder;
    isRequired;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], DesignArea.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "product_id" }),
    __metadata("design:type", String)
], DesignArea.prototype, "productId", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.designAreas),
    JoinColumn({ name: "product_id" }),
    __metadata("design:type", Product)
], DesignArea.prototype, "product", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], DesignArea.prototype, "name", void 0);
__decorate([
    Column("varchar", { name: "area_key", nullable: true }),
    __metadata("design:type", Object)
], DesignArea.prototype, "areaKey", void 0);
__decorate([
    Column("int", { name: "width_px" }),
    __metadata("design:type", Number)
], DesignArea.prototype, "widthPx", void 0);
__decorate([
    Column("int", { name: "height_px" }),
    __metadata("design:type", Number)
], DesignArea.prototype, "heightPx", void 0);
__decorate([
    Column("int", { name: "top_px" }),
    __metadata("design:type", Number)
], DesignArea.prototype, "topPx", void 0);
__decorate([
    Column("int", { name: "left_px" }),
    __metadata("design:type", Number)
], DesignArea.prototype, "leftPx", void 0);
__decorate([
    Column("simple-array", { name: "allowed_file_types", nullable: true }),
    __metadata("design:type", Object)
], DesignArea.prototype, "allowedFileTypes", void 0);
__decorate([
    Column("int", { name: "dpi_requirement", nullable: true }),
    __metadata("design:type", Object)
], DesignArea.prototype, "dpiRequirement", void 0);
__decorate([
    Column("int", { name: "sort_order", default: 0 }),
    __metadata("design:type", Number)
], DesignArea.prototype, "sortOrder", void 0);
__decorate([
    Column("boolean", { name: "is_required", default: false }),
    __metadata("design:type", Boolean)
], DesignArea.prototype, "isRequired", void 0);
DesignArea = __decorate([
    Entity('design_areas')
], DesignArea);
export { DesignArea };
