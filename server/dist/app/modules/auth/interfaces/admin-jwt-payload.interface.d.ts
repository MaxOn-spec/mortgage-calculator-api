export interface AdminJwtPayload {
    sub: string;
    login: string;
    type: 'admin';
    iat?: number;
    exp?: number;
}
