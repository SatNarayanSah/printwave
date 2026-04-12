# Persomith Admin Panel Documentation

**Platform Overview**  
Persomith is a custom print-on-demand platform based in Janakpur, specializing in personalized t-shirts, cups, hoodies, clothing, and other merchandise with Mithila-inspired and customer-designed prints.

This document explains **all features and pages** available in the **Admin Role**. The admin has full control over the platform, including customers, designers, orders, production, shipping, and finances.

**Last Updated:** April 2026  
**Version:** 1.0

---

## Table of Contents

- [Dashboard](#dashboard)
- [User Management](#user-management)
- [Product Management](#product-management)
- [Design Management](#design-management)
- [Order Management](#order-management)
- [Shipping Control](#shipping-control)
- [Printing & Production](#printing--production)
- [Finance & Payments](#finance--payments)
- [Marketing & Promotions](#marketing--promotions)
- [Reports & Analytics](#reports--analytics)
- [Settings](#settings)
- [Content Management](#content-management)

---

## Dashboard

The main landing page after admin login.

**Key Features:**
- Real-time overview widgets: Total Orders, Total Revenue, Pending Orders, Active Customers, Approved Designs
- Quick stats for today, this week, and this month
- Recent Orders list
- Top Selling Products & Designs
- Low Stock Alerts (if inventory is used)
- Notification panel for pending approvals and shipping delays

**Purpose:** Give admins a quick snapshot of business health.

---

## User Management

Manage all users on the platform.

**Pages & Features:**
- **All Users** — View, search, filter by role (Customer / Designer / Admin)
- **Customers List** — View customer details, order history, addresses, and activity
- **Designers List** — View designer portfolio, earnings, approval status, and performance
- **Add New User** — Manually create accounts and assign roles
- **Edit / Block / Delete User** — Update profiles, change roles, or suspend accounts
- **Role Assignment** — Switch users between Customer, Designer, or Admin

**Note:** Designers must be approved before they can upload paid designs.

---

## Product Management

Control all blank products available for printing.

**Pages & Features:**
- **All Products** — List of t-shirts, cups, hoodies, tote bags, etc.
- **Add New Product** — Upload new blank templates with variants (sizes, colors)
- **Product Categories** — Organize by type (Apparel, Drinkware, Accessories)
- **Variants Management** — Add/edit sizes, colors, and pricing
- **Product Approval** — Review products uploaded by designers (if allowed)

---

## Design Management

Central hub for all custom designs.

**Pages & Features:**
- **All Designs** — Gallery view of every design on the platform
- **Design Library** — Searchable collection with filters (Mithila style, modern, text-based, etc.)
- **Design Approval Queue** — Review and approve/reject designs submitted by designers or customers
- **Designer Earnings** — View and manage commission rates per designer
- **Design Categories & Tags** — Manage tags like "Janakpur Special", "Festival", "Mithila Art"

---

## Order Management

Full control over customer orders.

**Pages & Features:**
- **All Orders** — Filter by status (Pending, Confirmed, Printing, Shipped, Delivered, Cancelled)
- **Order Details** — View full order info, custom design preview, customer notes, and payment status
- **Bulk Actions** — Update multiple orders at once (e.g., mark as "Ready for Print")
- **Refund & Return Handling** — Process refunds and manage return requests
- **Order Search & Export** — Export orders to CSV/Excel

---

## Shipping Control

Complete shipping management (critical for Nepal operations).

**Pages & Features:**
- **Shipping Dashboard** — Overview of all shipments and delays
- **All Shipments** — Track every package with status
- **Shipping Zones** — Define rates for Janakpur local, other Nepal districts, and international
- **Shipping Methods** — Manage couriers (Local bike delivery, Nepal Post, Third-party logistics)
- **Generate Shipping Labels** — Create labels and tracking numbers
- **Update Tracking** — Manually or automatically update tracking status
- **Shipping Reports** — Cost analysis, success rate, and average delivery time

---

## Printing & Production

Manage in-house or outsourced printing workflow.

**Pages & Features:**
- **Production Queue** — List of orders ready to print, sorted by priority
- **Print Job Status** — Track "Pending → In Progress → Completed → Quality Check"
- **Printer Management** — Add and monitor printing machines/devices
- **Quality Check** — Approve or reject printed items before shipping
- **Production Reports** — Daily/weekly printing volume

---

## Finance & Payments

Handle all money-related activities.

**Pages & Features:**
- **Revenue Dashboard** — Total sales, profit, and trends
- **All Transactions** — View customer payments and refunds
- **Designer Payouts** — Track commissions and process withdrawals for designers
- **Expense Management** — Record printing cost, shipping cost, etc.
- **Profit & Loss Report** — Detailed financial reports
- **Withdraw Requests** — Approve or reject designer payout requests

---

## Marketing & Promotions

Promote the platform and run campaigns.

**Pages & Features:**
- **Coupons & Discounts** — Create and manage promo codes
- **Offers & Campaigns** — Seasonal or festival offers (e.g., Dashain, Chhath)
- **Banner Management** — Upload and schedule homepage banners
- **Email & SMS Templates** — Create notification templates

---

## Reports & Analytics

Data-driven insights for business growth.

**Pages & Features:**
- Sales Report
- Customer Analytics (repeat buyers, location-wise)
- Designer Performance Report
- Top Selling Products & Designs
- Shipping Analytics
- Product Performance Report

---

## Settings

Global configuration for the platform.

**Pages & Features:**
- **General Settings** — Company name (Persomith), logo, address in Janakpur, contact info
- **Payment Gateways** — Configure eSewa, Khalti, IME Pay, Cash on Delivery, Bank Transfer
- **Tax & Currency Settings**
- **Email & Notification Settings**
- **SEO & Meta Settings**
- **Security Settings** (password policy, 2FA, etc.)

---

## Content Management

Manage public-facing content.

**Pages & Features:**
- Static Pages (About Us, Contact, FAQ, Shipping Policy)
- Blog / News Section
- Mithila Art Inspiration Gallery
- Homepage Slider & Featured Sections

---

## Additional Notes

- All pages support **search**, **filter**, **pagination**, and **export** features.
- Admins can view **activity logs** for important actions (recommended to add later).
- Role-based access: Admin sees everything. Designers and Customers have limited dashboards.

**For Developers:**  
Each section should have proper permission checks. Use soft deletes where possible for data safety.

---

**End of Document**

You can expand this file later with screenshots, API details, or user flow diagrams.
