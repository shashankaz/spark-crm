"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: "comments",
    versionKey: "version",
});
commentSchema.index({ leadId: 1 });
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
