"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDealStatus = exports.calcChange = void 0;
const calcChange = (current, previous) => {
    if (previous === 0)
        return current > 0 ? "+100%" : "0%";
    const pct = Math.round(((current - previous) / previous) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
};
exports.calcChange = calcChange;
const getDealStatus = (probability) => {
    if (probability >= 100)
        return "Won";
    if (probability <= 0)
        return "Lost";
    return "In Progress";
};
exports.getDealStatus = getDealStatus;
