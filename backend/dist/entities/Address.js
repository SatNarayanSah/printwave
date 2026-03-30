var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User.js";
import { Order } from "./Order.js";
let Address = class Address {
    id;
    userId;
    user;
    label;
    street;
    city;
    district;
    province;
    isDefault;
    createdAt;
    orders;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Address.prototype, "id", void 0);
__decorate([
    Column("uuid", { name: "user_id" }),
    __metadata("design:type", String)
], Address.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", User)
], Address.prototype, "user", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Address.prototype, "label", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Address.prototype, "district", void 0);
__decorate([
    Column("varchar"),
    __metadata("design:type", String)
], Address.prototype, "province", void 0);
__decorate([
    Column("boolean", { name: "is_default", default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "isDefault", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], Address.prototype, "createdAt", void 0);
__decorate([
    OneToMany(() => Order, (order) => order.address),
    __metadata("design:type", Array)
], Address.prototype, "orders", void 0);
Address = __decorate([
    Entity('addresses')
], Address);
export { Address };
