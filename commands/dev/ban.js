const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    kpd = data.kpd,
    logger = require('../../modules/logger'),
    { createEmbed } = require('../../modules/messageUtils');
module.exports = {
    name: 'ban',
    cooldown: 0,
    aliases: ['ban'],
    description: 'A command made for staff/kpd to ban users from using the bot',
    expectedArgs: 'k/ban (ID / @user)',
    dev: true,
    execute: async(message, args, bot) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || kpd.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        if (devs.includes(target.id) || staff.includes(target.id) || kpd.includes(target.id)) return message.reply(createEmbed(message.author, 'RED', 'You cannot ban devs/bot staff'));
        if (target.id == message.author.id) return message.reply(createEmbed(message.author, 'RED', 'You can\'t ban yourself man'));
        if (target.id == bot.user.id) return message.reply(createEmbed(message.author, 'RED', 'You can\'t ban the bot itself wtf'));
        if (await db.utils.banned(target.id) == true) return message.reply(createEmbed(message.author, 'RED', `\`${target.username}\` is already banned`));
        await db.utils.ban(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully banned \`${target.username}\``));
        logger.commandsLog(message.author, 'ban', `**${message.author.tag}** banned **${target.tag}**`, message.guild, args.join(' '), 'Action : Ban');
    },
};
