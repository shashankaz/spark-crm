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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        immutable: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin", "super_admin"],
        default: "user",
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
    },
}, {
    timestamps: true,
    collection: "users",
    versionKey: "version",
});
userSchema.index({ tenantId: 1 });
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.email)
            this.email = this.email.toLowerCase();
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
