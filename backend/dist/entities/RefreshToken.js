var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/entities/RefreshToken.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";
let RefreshToken = class RefreshToken {
    id;
    token;
    userId;
    user;
    expiresAt;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], RefreshToken.prototype, "id", void 0);
__decorate([
    Column("varchar", { unique: true }),
    __metadata("design:type", String)
], RefreshToken.prototype, "token", void 0);
__decorate([
    Column("uuid", { name: "user_id" }),
    __metadata("design:type", String)
], RefreshToken.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' }),
    JoinColumn({ name: "user_id" }),
    __metadata("design:type", User)
], RefreshToken.prototype, "user", void 0);
__decorate([
    Column({ name: "expires_at", type: "timestamp" }),
    __metadata("design:type", Date)
], RefreshToken.prototype, "expiresAt", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp", name: "created_at" }),
    __metadata("design:type", Date)
], RefreshToken.prototype, "createdAt", void 0);
RefreshToken = __decorate([
    Entity('refresh_tokens')
], RefreshToken);
export { RefreshToken };
