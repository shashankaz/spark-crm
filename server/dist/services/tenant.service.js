"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserForTenantService = exports.deleteTenantByIdService = exports.updateTenantByIdService = exports.createTenantService = exports.fetchUsersByTenantIdService = exports.fetchTenantByIdService = exports.fetchTenantsService = exports.fetchTenantDashboardStatsService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const tenant_model_js_1 = require("../models/tenant.model.js");
const user_model_js_1 = require("../models/user.model.js");
const bcrypt_js_1 = require("../utils/auth/bcrypt.js");
const app_error_js_1 = require("../shared/app-error.js");
const plans_js_1 = require("../utils/plans.js");
const stats_helper_js_1 = require("../utils/stats-helper.js");
const fetchTenantDashboardStatsService = (input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [tenantAgg, userAgg] = yield Promise.all([
        tenant_model_js_1.Tenant.aggregate([
            { $match: { isDeleted: false } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    lastMonth: [
                        { $match: { createdAt: { $lt: startOfThisMonth } } },
                        { $count: "count" },
                    ],
                    planCounts: [{ $group: { _id: "$plan", count: { $sum: 1 } } }],
                    lastMonthPlanCounts: [
                        { $match: { createdAt: { $lt: startOfThisMonth } } },
                        { $group: { _id: "$plan", count: { $sum: 1 } } },
                    ],
                    recent: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                plan: 1,
                                address: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                },
            },
        ]),
        user_model_js_1.User.aggregate([
            { $match: { role: { $ne: "super_admin" } } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    lastMonth: [
                        { $match: { createdAt: { $lt: startOfThisMonth } } },
                        { $count: "count" },
                    ],
                },
            },
        ]),
    ]);
    const totalTenants = (_b = (_a = tenantAgg[0].total[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
    const tenantsLastMonth = (_d = (_c = tenantAgg[0].lastMonth[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
    const planCounts = tenantAgg[0].planCounts;
    const lastMonthPlanCounts = tenantAgg[0].lastMonthPlanCounts;
    const totalUsers = (_f = (_e = userAgg[0].total[0]) === null || _e === void 0 ? void 0 : _e.count) !== null && _f !== void 0 ? _f : 0;
    const usersLastMonth = (_h = (_g = userAgg[0].lastMonth[0]) === null || _g === void 0 ? void 0 : _g.count) !== null && _h !== void 0 ? _h : 0;
    const currentRevenue = planCounts.reduce((sum, p) => sum + (plans_js_1.PLAN_PRICES[p._id] || 0) * p.count, 0);
    const lastMonthRevenue = lastMonthPlanCounts.reduce((sum, p) => sum + (plans_js_1.PLAN_PRICES[p._id] || 0) * p.count, 0);
    const paidPlans = planCounts
        .filter((p) => p._id !== "free")
        .reduce((sum, p) => sum + p.count, 0);
    const lastMonthPaidPlans = lastMonthPlanCounts
        .filter((p) => p._id !== "free")
        .reduce((sum, p) => sum + p.count, 0);
    const stats = {
        totalTenants: {
            value: totalTenants,
            change: (0, stats_helper_js_1.calcChange)(totalTenants, tenantsLastMonth),
            trend: totalTenants >= tenantsLastMonth ? "up" : "down",
        },
        totalUsers: {
            value: totalUsers,
            change: (0, stats_helper_js_1.calcChange)(totalUsers, usersLastMonth),
            trend: totalUsers >= usersLastMonth ? "up" : "down",
        },
        monthlyRevenue: {
            value: currentRevenue,
            change: (0, stats_helper_js_1.calcChange)(currentRevenue, lastMonthRevenue),
            trend: currentRevenue >= lastMonthRevenue ? "up" : "down",
        },
        paidPlans: {
            value: paidPlans,
            change: (0, stats_helper_js_1.calcChange)(paidPlans, lastMonthPaidPlans),
            trend: paidPlans >= lastMonthPaidPlans ? "up" : "down",
        },
    };
    const recentTenants = tenantAgg[0].recent.map((t) => {
        var _a, _b;
        return ({
            _id: t._id,
            name: t.name,
            email: t.email,
            plan: t.plan,
            city: ((_a = t.address) === null || _a === void 0 ? void 0 : _a.city) || "",
            country: ((_b = t.address) === null || _b === void 0 ? void 0 : _b.country) || "",
            createdAt: (0, date_fns_1.formatDate)(new Date(t.createdAt), "yyyy-MM-dd"),
        });
    });
    const planDistribution = planCounts.map((p) => ({
        plan: p._id,
        count: p.count,
    }));
    return { stats, recentTenants, planDistribution };
});
exports.fetchTenantDashboardStatsService = fetchTenantDashboardStatsService;
const fetchTenantsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ cursor, limit, search, }) {
    const countQuery = { isDeleted: false };
    if (search) {
        countQuery.name = { $regex: search, $options: "i" };
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $gt: cursor };
    }
    const [totalCount, tenants] = yield Promise.all([
        tenant_model_js_1.Tenant.countDocuments(countQuery).exec(),
        tenant_model_js_1.Tenant.find(whereQuery).sort({ createdAt: -1 }).limit(limit).exec(),
    ]);
    const formattedTenants = tenants.map((tenant) => {
        var _a;
        return ({
            _id: tenant._id,
            name: tenant.name,
            email: tenant.email,
            mobile: tenant.mobile,
            address: {
                country: ((_a = tenant.address) === null || _a === void 0 ? void 0 : _a.country) || "",
            },
            plan: tenant.plan,
            updatedAt: (0, date_fns_1.formatDate)(tenant.updatedAt, "dd/MM/yyyy"),
        });
    });
    return { tenants: formattedTenants, totalCount };
});
exports.fetchTenantsService = fetchTenantsService;
const fetchTenantByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id }) {
    const [tenant, usersCount] = yield Promise.all([
        tenant_model_js_1.Tenant.findOne({ _id: id, isDeleted: false }).exec(),
        user_model_js_1.User.countDocuments({ tenantId: id }).exec(),
    ]);
    if (!tenant) {
        throw new app_error_js_1.AppError("Tenant not found", 404);
    }
    return {
        tenant,
        usersCount,
    };
});
exports.fetchTenantByIdService = fetchTenantByIdService;
const fetchUsersByTenantIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, search, }) {
    const whereQuery = { tenantId };
    if (search) {
        whereQuery.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const users = yield user_model_js_1.User.find(whereQuery).exec();
    const formattedUsers = users.map((user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        updatedAt: (0, date_fns_1.formatDate)(user.updatedAt, "dd/MM/yyyy"),
    }));
    return {
        users: formattedUsers,
    };
});
exports.fetchUsersByTenantIdService = fetchUsersByTenantIdService;
const createTenantService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, gstNumber, panNumber, email, mobile, address, plan, }) {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const tenant = yield tenant_model_js_1.Tenant.create([
            {
                name,
                gstNumber: gstNumber || undefined,
                panNumber: panNumber || undefined,
                email,
                mobile,
                address: {
                    line1: (address === null || address === void 0 ? void 0 : address.line1) || undefined,
                    line2: (address === null || address === void 0 ? void 0 : address.line2) || undefined,
                    city: (address === null || address === void 0 ? void 0 : address.city) || undefined,
                    state: (address === null || address === void 0 ? void 0 : address.state) || undefined,
                    country: (address === null || address === void 0 ? void 0 : address.country) || undefined,
                    postalCode: (address === null || address === void 0 ? void 0 : address.postalCode) || undefined,
                },
                plan,
            },
        ], { session });
        const createdTenant = tenant[0];
        // const tempPassword = randomBytes(9).toString("base64");
        const tempPassword = "Asdf@1234";
        const hashedPassword = yield (0, bcrypt_js_1.hashPassword)(tempPassword);
        console.log(`Creating admin user for tenant ${createdTenant._id} with email ${email} and temp password ${tempPassword}`);
        yield user_model_js_1.User.create([
            {
                tenantId: createdTenant._id,
                firstName: name.split(" ")[0],
                lastName: name.split(" ").slice(1).join(" ") || "",
                email,
                mobile: mobile || "",
                password: hashedPassword,
                role: "admin",
            },
        ], { session });
        yield session.commitTransaction();
        return { tenant: createdTenant };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.createTenantService = createTenantService;
const updateTenantByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, name, gstNumber, panNumber, email, mobile, address, plan, }) {
    const tenant = yield tenant_model_js_1.Tenant.findOne({ _id: id, isDeleted: false }).exec();
    if (!tenant) {
        throw new app_error_js_1.AppError("Tenant not found", 404);
    }
    tenant.name = name || tenant.name;
    tenant.gstNumber = gstNumber || tenant.gstNumber;
    tenant.panNumber = panNumber || tenant.panNumber;
    tenant.email = email || tenant.email;
    tenant.mobile = mobile || tenant.mobile;
    tenant.address = address || tenant.address;
    tenant.plan = plan || tenant.plan;
    return tenant.save();
});
exports.updateTenantByIdService = updateTenantByIdService;
const deleteTenantByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, }) {
    const tenant = yield tenant_model_js_1.Tenant.findOne({ _id: id, isDeleted: false }).exec();
    if (!tenant) {
        throw new app_error_js_1.AppError("Tenant not found", 404);
    }
    tenant.isDeleted = true;
    tenant.deletedAt = new Date();
    yield tenant.save();
    return true;
});
exports.deleteTenantByIdService = deleteTenantByIdService;
const createUserForTenantService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, name, email, mobile, password, role, }) {
    const tenant = yield tenant_model_js_1.Tenant.findOne({
        _id: tenantId,
        isDeleted: false,
    }).exec();
    if (!tenant) {
        throw new app_error_js_1.AppError("Tenant not found", 404);
    }
    const hashedPassword = yield (0, bcrypt_js_1.hashPassword)(password);
    return user_model_js_1.User.create({
        tenantId,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
        email,
        mobile: mobile || "",
        password: hashedPassword,
        role,
    });
});
exports.createUserForTenantService = createUserForTenantService;
