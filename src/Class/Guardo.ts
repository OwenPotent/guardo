import { GuildMember, Message, Role } from "discord.js";
import ms from "ms";
import { version } from "../../package.json";
import { checkBotPerms, checkRole, checkUserPerms, embedder, userExist } from "../Functions/Functions";
import { BanOptions, KickOptions, MuteOptions } from "../Interfaces/GuardoFunctionOptions";
import { GuardoClientOptions } from "../Interfaces/GuardoOptions";
import * as MuteModel from "../Models/MuteModel";

export class Guardo {
    private defaultOptions!: GuardoClientOptions

    constructor(options?: GuardoClientOptions) {
        this.defaultOptions.mongoURI = options?.mongoURI
    }

    /**
     * Advanced ban function with additional options,
     * able to ban members outside the guild aswell.
     */
    public async ban(message: Message, user: GuildMember, options?: BanOptions): Promise<Error | Message> {
        const checkMessage = message instanceof Message
        if (!message || checkMessage === false) return new Error("Guardo: No 'Message' object provided or is invalid.")

        checkBotPerms("BAN_MEMBERS", message)
        checkUserPerms("BAN_MEMBERS", message)
        userExist(user, message)

        if (options) {
            if (!options.reason || typeof options.reason !== "string") options.reason = "No reason provided"
            if (!options.days) options.days = 0
            if (isNaN(options.days)) return new Error("Guardo: No valid number for days was provided.")
            if (typeof options.description !== "string") return new TypeError(`Guardo: "description" was not a type of string, recieved ${typeof options.description}`)
        }

        await user.ban({
            reason: options?.reason,
            days: options?.days
        })

        return embedder(options?.description, message)
    }

    /**
     * Advanced kick command with additional options
     */
    public async kick(message: Message, user: GuildMember, options?: KickOptions): Promise<Error | Message> {
        const checkMessage = message instanceof Message
        if (!message || checkMessage === false) return new Error("Guardo: No 'Message' object provided or is invalid.")

        checkBotPerms("KICK_MEMBERS", message)
        checkUserPerms("KICK_MEMBERS", message)
        userExist(user, message)

        if (options) {
            if (!options.reason || typeof options.reason !== "string") options.reason = "No reason provided"
            if (typeof options.description !== "string") return new TypeError(`Guardo: "description" was not a type of string, recieved ${typeof options.description}`)
        }

        await user.kick(options?.reason)

        return embedder(options?.description, message)
    }

    /**
     * Mute command with duration limit and more options
     * @todo Work on saving duration to database.
     */
    public async mute(message: Message, user: GuildMember, role: Role, options?: MuteOptions): Promise<Error | Message | NodeJS.Timeout> {
        const checkMessage = message instanceof Message
        if (!message || checkMessage === false) return new Error("Guardo: No 'Message' object provided or is invalid.")

        checkBotPerms("MANAGE_ROLES", message)
        checkUserPerms("MANAGE_MESSAGES", message)
        userExist(user, message)
        checkRole(role, message)

        if (options) {

            if (options.time) {
                if (isNaN(parseInt(options.time)) || !options.time.endsWith("s" || "m" || "h" || "d"))
                    return new Error("Guardo: Invalid time or time does not end with s/m/h/d")
            } else {
                options.time = "false"
            }
            if (typeof options.description !== "string") return new TypeError(`Guardo: "description" is not a type of string, recieved ${typeof options.description}`)
            if (typeof options.roleReason !== "string") return new TypeError(`Guardo: "roleReason" is not a type of string, recieved ${typeof options.roleReason}`)
        }

        if (options?.time === "false" || options?.time === null) {
            await user.roles.add(role.id, options?.roleReason)

            return embedder(options.description, message)
        } else {
            await user.roles.add(role, options?.roleReason)

            embedder(options?.description, message)

            return setTimeout(() => {
                user.roles.remove(role.id)
            }, ms(options?.time || "3h"))
        }
    }

    /**
     * Easy unmute with no difficulty and more options
     */
    public async unmute(message: Message, user: GuildMember, role: Role, description?: string, roleReason?: string): Promise<Error | Message> {
        const checkMessage = message instanceof Message
        if (!message || checkMessage === false) return new Error("Guardo: No 'Message' object provided or is invalid.")

        checkBotPerms("MANAGE_ROLES", message)
        checkUserPerms("MANAGE_MESSAGES", message)
        userExist(user, message)
        checkRole(role, message)

        if (typeof description !== "string") return new TypeError(`Guardo: "description" was not a type of string, recieved ${typeof description}`)

        await user.roles.remove(role.id, roleReason)

        return embedder(description, message)
    }

    public get version(): string {
        return version
    }
}