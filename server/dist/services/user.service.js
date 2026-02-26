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
exports.removeUserService = exports.updateUserService = exports.createUserService = exports.fetchUserByIdService = exports.fetchUsersService = void 0;
const date_fns_1 = require("date-fns");
const user_model_js_1 = require("../models/user.model.js");
const bcrypt_js_1 = require("../utils/auth/bcrypt.js");
const app_error_js_1 = require("../shared/app-error.js");
const fetchUsersService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, cursor, limit, search, }) {
    const countQuery = { tenantId };
    if (search) {
        countQuery.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $gt: cursor };
    }
    const [totalCount, users] = yield Promise.all([
        user_model_js_1.User.countDocuments(countQuery).exec(),
        user_model_js_1.User.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
    ]);
    const formattedUsers = users.map((user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        updatedAt: (0, date_fns_1.formatDate)(user.updatedAt, "dd/MM/yyyy"),
    }));
    return { users: formattedUsers, totalCount };
});
exports.fetchUsersService = fetchUsersService;
const fetchUserByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, id, }) {
    return yield user_model_js_1.User.findOne({ _id: id, tenantId }).exec();
});
exports.fetchUserByIdService = fetchUserByIdService;
const createUserService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, firstName, lastName, email, mobile, password, role, }) {
    const hashedPassword = yield (0, bcrypt_js_1.hashPassword)(password);
    const newUser = new user_model_js_1.User({
        firstName,
        lastName: lastName || undefined,
        email,
        mobile: mobile || undefined,
        password: hashedPassword,
        role: role || "user",
        tenantId,
    });
    return yield newUser.save();
});
exports.createUserService = createUserService;
const updateUserService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, id, firstName, lastName, email, mobile, password, role, }) {
    const user = yield user_model_js_1.User.findOne({ _id: id, tenantId }).exec();
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    if (firstName)
        user.firstName = firstName;
    if (lastName)
        user.lastName = lastName;
    if (email)
        user.email = email;
    if (mobile)
        user.mobile = mobile;
    if (password)
        user.password = yield (0, bcrypt_js_1.hashPassword)(password);
    if (role)
        user.role = role;
    return yield user.save();
});
exports.updateUserService = updateUserService;
const removeUserService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, id }) {
    const user = yield user_model_js_1.User.findOne({ _id: id, tenantId }).exec();
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    return yield user_model_js_1.User.deleteOne({ _id: id, tenantId }).exec();
});
exports.removeUserService = removeUserService;
