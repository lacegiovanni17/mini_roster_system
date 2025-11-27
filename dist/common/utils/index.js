"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
function generateToken(user, jwtService) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return jwtService.sign(payload);
}
//# sourceMappingURL=index.js.map