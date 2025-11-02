"use strict";
/**
 * @fileoverview Type definitions for AI Tuner Extension
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
/**
 * Log level enumeration
 * @enum LogLevel
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["CRITICAL"] = 4] = "CRITICAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
//# sourceMappingURL=types.js.map