export interface BanOptions {
    reason?: string,
    days?: number,
    description?: string
}
export interface KickOptions {
    reason?: string,
    description?: string
}

export interface MuteOptions {
    time: string | "30m",
    description?: string,
    roleReason?: string
}