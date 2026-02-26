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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDashboardStatsService = void 0;
const date_fns_1 = require("date-fns");
const lead_model_js_1 = require("../models/lead.model.js");
const deal_model_js_1 = require("../models/deal.model.js");
const organization_model_js_1 = require("../models/organization.model.js");
const user_model_js_1 = require("../models/user.model.js");
const stats_helper_js_1 = require("../utils/stats-helper.js");
const fetchDashboardStatsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, }) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [leadAgg, dealAgg, orgAgg, userAgg] = yield Promise.all([
        lead_model_js_1.Lead.aggregate([
            { $match: { tenantId } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    lastMonth: [
                        { $match: { createdAt: { $lt: startOfThisMonth } } },
                        { $count: "count" },
                    ],
                    recent: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                orgName: 1,
                                score: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                },
            },
        ]),
        deal_model_js_1.Deal.aggregate([
            { $match: { tenantId } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    lastMonth: [
                        { $match: { createdAt: { $lt: startOfThisMonth } } },
                        { $count: "count" },
                    ],
                    recent: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                value: 1,
                                probability: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                },
            },
        ]),
        organization_model_js_1.Organization.aggregate([
            { $match: { tenantId } },
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
        user_model_js_1.User.aggregate([
            { $match: { tenantId } },
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
    const totalLeads = (_c = (_b = leadAgg[0].total[0]) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0;
    const leadsLastMonth = (_e = (_d = leadAgg[0].lastMonth[0]) === null || _d === void 0 ? void 0 : _d.count) !== null && _e !== void 0 ? _e : 0;
    const totalDeals = (_g = (_f = dealAgg[0].total[0]) === null || _f === void 0 ? void 0 : _f.count) !== null && _g !== void 0 ? _g : 0;
    const dealsLastMonth = (_j = (_h = dealAgg[0].lastMonth[0]) === null || _h === void 0 ? void 0 : _h.count) !== null && _j !== void 0 ? _j : 0;
    const totalOrganizations = (_l = (_k = orgAgg[0].total[0]) === null || _k === void 0 ? void 0 : _k.count) !== null && _l !== void 0 ? _l : 0;
    const orgsLastMonth = (_o = (_m = orgAgg[0].lastMonth[0]) === null || _m === void 0 ? void 0 : _m.count) !== null && _o !== void 0 ? _o : 0;
    const totalUsers = (_q = (_p = userAgg[0].total[0]) === null || _p === void 0 ? void 0 : _p.count) !== null && _q !== void 0 ? _q : 0;
    const usersLastMonth = (_s = (_r = userAgg[0].lastMonth[0]) === null || _r === void 0 ? void 0 : _r.count) !== null && _s !== void 0 ? _s : 0;
    const stats = {
        totalLeads: {
            value: totalLeads,
            change: (0, stats_helper_js_1.calcChange)(totalLeads, leadsLastMonth),
            trend: totalLeads >= leadsLastMonth ? "up" : "down",
        },
        totalDeals: {
            value: totalDeals,
            change: (0, stats_helper_js_1.calcChange)(totalDeals, dealsLastMonth),
            trend: totalDeals >= dealsLastMonth ? "up" : "down",
        },
        totalOrganizations: {
            value: totalOrganizations,
            change: (0, stats_helper_js_1.calcChange)(totalOrganizations, orgsLastMonth),
            trend: totalOrganizations >= orgsLastMonth ? "up" : "down",
        },
        totalUsers: {
            value: totalUsers,
            change: (0, stats_helper_js_1.calcChange)(totalUsers, usersLastMonth),
            trend: totalUsers >= usersLastMonth ? "up" : "down",
        },
    };
    const recentLeads = leadAgg[0].recent.map((lead) => ({
        _id: lead._id,
        name: `${lead.firstName} ${lead.lastName || ""}`.trim(),
        email: lead.email,
        organization: lead.orgName || "",
        score: lead.score || 0,
        updatedAt: (0, date_fns_1.format)(new Date(lead.updatedAt), "yyyy-MM-dd"),
    }));
    const recentDeals = dealAgg[0].recent.map((deal) => ({
        _id: deal._id,
        title: deal.name,
        value: deal.value || 0,
        status: (0, stats_helper_js_1.getDealStatus)(deal.probability || 0),
        updatedAt: (0, date_fns_1.format)(new Date(deal.updatedAt), "yyyy-MM-dd"),
    }));
    return { stats, recentLeads, recentDeals };
});
exports.fetchDashboardStatsService = fetchDashboardStatsService;
