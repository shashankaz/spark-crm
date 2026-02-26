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
exports.deleteOrganizationByIdService = exports.updateOrganizationByIdService = exports.createOrganizationService = exports.fetchOrganizationByIdService = exports.fetchOrganizationsService = void 0;
const date_fns_1 = require("date-fns");
const organization_model_js_1 = require("../models/organization.model.js");
const app_error_js_1 = require("../shared/app-error.js");
const fetchOrganizationsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, cursor, limit, search, }) {
    const countQuery = { tenantId };
    if (search) {
        countQuery.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { contactName: { $regex: search, $options: "i" } },
        ];
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $gt: cursor };
    }
    const [totalCount, organizations] = yield Promise.all([
        organization_model_js_1.Organization.countDocuments(countQuery).exec(),
        organization_model_js_1.Organization.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
    ]);
    const formattedOrganizations = organizations.map((org) => ({
        _id: org._id,
        name: org.name,
        industry: org.industry || undefined,
        country: org.country || undefined,
        size: org.size || undefined,
        website: org.website || undefined,
        updatedAt: (0, date_fns_1.formatDate)(org.updatedAt, "dd/MM/yyyy"),
    }));
    return { organizations: formattedOrganizations, totalCount };
});
exports.fetchOrganizationsService = fetchOrganizationsService;
const fetchOrganizationByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, }) {
    return yield organization_model_js_1.Organization.findOne({ _id: id, tenantId }).exec();
});
exports.fetchOrganizationByIdService = fetchOrganizationByIdService;
const createOrganizationService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ idempotentId, tenantId, userId, name, industry, size, country, email, mobile, website, contactName, contactEmail, contactMobile, }) {
    return yield organization_model_js_1.Organization.create({
        idempotentId,
        tenantId,
        userId,
        name,
        industry: industry,
        size: size,
        country: country,
        email: email || undefined,
        mobile: mobile || undefined,
        website: website || undefined,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        contactMobile: contactMobile || undefined,
    });
});
exports.createOrganizationService = createOrganizationService;
const updateOrganizationByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, userId, name, industry, size, country, email, mobile, website, contactName, contactEmail, contactMobile, }) {
    const organization = yield organization_model_js_1.Organization.findOne({ _id: id, tenantId }).exec();
    if (!organization) {
        throw new app_error_js_1.AppError("Organization not found", 404);
    }
    organization.userId = userId || organization.userId;
    organization.name = name || organization.name;
    organization.industry = industry || organization.industry;
    organization.size = size || organization.size;
    organization.country = country || organization.country;
    organization.email = email || organization.email;
    organization.mobile = mobile || organization.mobile;
    organization.website = website || organization.website;
    organization.contactName = contactName || organization.contactName;
    organization.contactEmail = contactEmail || organization.contactEmail;
    organization.contactMobile = contactMobile || organization.contactMobile;
    return yield organization.save();
});
exports.updateOrganizationByIdService = updateOrganizationByIdService;
const deleteOrganizationByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, }) {
    const organization = yield organization_model_js_1.Organization.findOne({ _id: id, tenantId }).exec();
    if (!organization) {
        throw new app_error_js_1.AppError("Organization not found", 404);
    }
    return yield organization_model_js_1.Organization.deleteOne({ _id: id, tenantId }).exec();
});
exports.deleteOrganizationByIdService = deleteOrganizationByIdService;
