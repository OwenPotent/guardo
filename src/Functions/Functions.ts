import { Client, GuildMember, Message, MessageEmbed, PermissionString, Role } from "discord.js";

export function checkBotPerms(permissions: PermissionString | PermissionString[], message: Message) {
    if (!message) return new Error("Guardo: No message was provided.")

    if (!message.guild?.me?.permissions.has(permissions)) return new Error(`Guardo: Bot does not have permissions.\n${permissions}`)
}

export function checkUserPerms(permissions: PermissionString | PermissionString[], message: Message) {
    if (!message) return new Error("Guardo: No message was provided.")
    
    if (!message.member?.permissions.has(permissions)) return new Error(`Guardo: User does not have permissions.\n${permissions}`)
}

export function checkRole(role: Role, message: Message) {
    if (!message) return new Error("Guardo: No message was provided.")
    
    if (!message.guild?.roles.cache.get(role.id)) return new Error("Guardo: Invalid role.")
}

export function userExist(user: GuildMember, message: Message, client?: Client) {
    if (!user || message.guild?.members.cache.get(user.id) || client?.users.cache.get(user.id ? user.id : "12345") || user! instanceof GuildMember)
        return new Error("Guardo: User was either invalid or not provided.")
}

export function embedder(description: string | undefined, message: Message) {
    const embed = new MessageEmbed({
        description: description || "*Action Completed*",
        color: "GREEN",
        timestamp: Date.now()
    })

    return message.channel.send({ embeds: [embed] })
}