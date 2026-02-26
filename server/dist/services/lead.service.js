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
exports.fetchLeadActivityByLeadIdService = exports.fetchOrganizationsService = exports.convertLeadToDealService = exports.bulkWriteLeadsService = exports.deleteLeadByIdService = exports.updateLeadByIdService = exports.createLeadService = exports.fetchLeadByIdService = exports.fetchLeadsService = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
const lead_model_js_1 = require("../models/lead.model.js");
const deal_model_js_1 = require("../models/deal.model.js");
const organization_model_js_1 = require("../models/organization.model.js");
const app_error_js_1 = require("../shared/app-error.js");
const calculate_score_js_1 = require("../utils/calculate-score.js");
const lead_action_history_service_js_1 = require("./lead-action-history.service.js");
const lead_action_history_model_js_1 = require("../models/lead-action-history.model.js");
const fetchLeadsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, cursor, limit, search, }) {
    const countQuery = { tenantId };
    if (search) {
        countQuery.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $gt: cursor };
    }
    const [totalCount, leads] = yield Promise.all([
        lead_model_js_1.Lead.countDocuments(countQuery).exec(),
        lead_model_js_1.Lead.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
    ]);
    const formattedLeads = leads.map((lead) => ({
        _id: lead._id,
        firstName: lead.firstName,
        lastName: lead.lastName || "",
        email: lead.email,
        orgName: lead.orgName,
        score: lead.score || 0,
        updatedAt: (0, date_fns_1.formatDate)(lead.updatedAt, "dd/MM/yyyy"),
    }));
    return { leads: formattedLeads, totalCount };
});
exports.fetchLeadsService = fetchLeadsService;
const fetchLeadByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, }) {
    return yield lead_model_js_1.Lead.findOne({ _id: id, tenantId }).exec();
});
exports.fetchLeadByIdService = fetchLeadByIdService;
const createLeadService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ idempotentId, tenantId, orgId, orgName, userId, userName, firstName, lastName, email, mobile, gender, source, }) {
    const lead = new lead_model_js_1.Lead({
        idempotentId,
        tenantId,
        orgId,
        orgName,
        dealId: undefined,
        userId,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
        mobile: mobile || undefined,
        gender: gender || undefined,
        source: source || undefined,
    });
    lead.score = (0, calculate_score_js_1.calculateLeadScore)(lead);
    yield (0, lead_action_history_service_js_1.createLeadActionHistoryService)({
        leadId: lead._id,
        actionType: "lead_created",
        message: `Lead created by ${userName}`,
        userId,
        userName,
    });
    return yield lead.save();
});
exports.createLeadService = createLeadService;
const updateLeadByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, orgId, orgName, userId, userName, firstName, lastName, email, mobile, gender, source, status, }) {
    const lead = yield lead_model_js_1.Lead.findOne({ _id: id, tenantId }).exec();
    if (!lead) {
        throw new app_error_js_1.AppError("Lead not found", 404);
    }
    if (lead.dealId || lead.status === "converted") {
        throw new app_error_js_1.AppError("Cannot update a lead that has been converted to a deal", 400);
    }
    lead.orgId = orgId || lead.orgId;
    lead.orgName = orgName || lead.orgName;
    lead.userId = userId || lead.userId;
    lead.firstName = firstName || lead.firstName;
    lead.lastName = lastName || lead.lastName;
    lead.email = email || lead.email;
    lead.mobile = mobile || lead.mobile;
    lead.gender = gender || lead.gender;
    lead.source = source || lead.source;
    lead.status = status || lead.status;
    lead.score = (0, calculate_score_js_1.calculateLeadScore)(lead);
    yield (0, lead_action_history_service_js_1.createLeadActionHistoryService)({
        leadId: lead._id,
        actionType: "lead_updated",
        message: `Lead updated by ${userName}`,
        userId,
        userName,
    });
    return yield lead.save();
});
exports.updateLeadByIdService = updateLeadByIdService;
const deleteLeadByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, userId, userName, }) {
    const lead = yield lead_model_js_1.Lead.findOne({ _id: id, tenantId }).exec();
    if (!lead) {
        throw new app_error_js_1.AppError("Lead not found", 404);
    }
    if (lead.dealId || lead.status === "converted") {
        throw new app_error_js_1.AppError("Cannot delete a lead that has been converted to a deal", 400);
    }
    yield (0, lead_action_history_service_js_1.createLeadActionHistoryService)({
        leadId: lead._id,
        actionType: "lead_deleted",
        message: `Lead deleted by ${userName}`,
        userId,
        userName,
    });
    return yield lead_model_js_1.Lead.deleteOne({ _id: id, tenantId }).exec();
});
exports.deleteLeadByIdService = deleteLeadByIdService;
const bulkWriteLeadsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, leads, }) {
    const operations = leads.map((lead) => {
        const document = {
            idempotentId: lead.idempotentId,
            tenantId,
            orgId: lead.orgId || undefined,
            orgName: lead.orgName || undefined,
            dealId: undefined,
            userId: lead.userId || undefined,
            firstName: lead.firstName || undefined,
            lastName: lead.lastName || undefined,
            email: lead.email || undefined,
            mobile: lead.mobile || undefined,
            gender: lead.gender || undefined,
            source: lead.source || undefined,
        };
        document.score = (0, calculate_score_js_1.calculateLeadScore)(document);
        return { insertOne: { document } };
    });
    return yield lead_model_js_1.Lead.bulkWrite(operations, { ordered: false });
});
exports.bulkWriteLeadsService = bulkWriteLeadsService;
const convertLeadToDealService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, userId, userName, idempotentId, dealName, value, probability, }) {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const lead = yield lead_model_js_1.Lead.findOne({ _id: id, tenantId })
            .session(session)
            .exec();
        if (!lead) {
            throw new app_error_js_1.AppError("Lead not found", 404);
        }
        if (lead.status === "converted") {
            throw new app_error_js_1.AppError("Lead has already been converted to a deal", 400);
        }
        const deal = new deal_model_js_1.Deal({
            idempotentId,
            tenantId,
            leadId: lead._id,
            userId: userId,
            name: dealName || "Untitled Deal",
            value: value !== null && value !== void 0 ? value : 0,
            probability: probability !== null && probability !== void 0 ? probability : 0,
        });
        yield deal.save({ session });
        lead.status = "converted";
        lead.dealId = deal._id;
        lead.score = (0, calculate_score_js_1.calculateLeadScore)(lead);
        yield lead.save({ session });
        yield (0, lead_action_history_service_js_1.createLeadActionHistoryService)({
            leadId: lead._id,
            actionType: "lead_converted",
            message: `Lead converted to deal "${deal.name}" by ${userName}`,
            userId,
            userName,
        });
        yield session.commitTransaction();
        return { deal };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.convertLeadToDealService = convertLeadToDealService;
const fetchOrganizationsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, limit, search, }) {
    const whereQuery = { tenantId };
    if (search) {
        whereQuery.name = { $regex: search, $options: "i" };
    }
    const organizations = yield organization_model_js_1.Organization.find(whereQuery)
        .select("_id name")
        .limit(limit)
        .exec();
    return { organizations };
});
exports.fetchOrganizationsService = fetchOrganizationsService;
const fetchLeadActivityByLeadIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ leadId, }) {
    return yield lead_action_history_model_js_1.LeadActionHistory.find({ leadId }).sort({ _id: -1 }).exec();
});
exports.fetchLeadActivityByLeadIdService = fetchLeadActivityByLeadIdService;
