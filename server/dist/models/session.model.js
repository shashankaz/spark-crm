"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    token: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    collection: "sessions",
    versionKey: "version",
});
sessionSchema.index({ userId: 1 });
exports.Session = (0, mongoose_1.model)("Session", sessionSchema);
