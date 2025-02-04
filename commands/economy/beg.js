import { MessageEmbed } from 'discord.js';
import { emotes, beg } from '../../data/index.js';
import db from '../../modules/db/economy.js';

export default {
    name: 'beg',
    aliases: ['beg'],
    cooldown: 300,
    description: `This command is used to get some ${emotes.kr} from famous Krunker members based on random chances. There is a chance to gain some ${emotes.kr} or nothing at all`,
    expectedArgs: 'k/beg',
    execute: async(message) => {
        const res = Math.floor(Math.random() * 2);
        const response = {
            positive: beg.responses[Math.floor(Math.random() * beg.responses.length)],
            negative: beg.noresponse[Math.floor(Math.random() * beg.noresponse.length)],
        };
        const KR = parseInt(Math.floor(Math.random() * 500) + 500);

        const userID = message.author.id;

        let color, desc, footer;
        if (res == 1) {
            color = 'GREEN',
            footer = 'stonks4u',
            desc = response.positive.replace('{value}', `${emotes.kr}${KR}`);
            await db.utils.addKR(userID, KR);
        } else {
            color = 'RED',
            footer = 'notstonks4u',
            desc = response.negative.replace('{value}', `${emotes.kr}${KR}`);
        }
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle(beg.people[Math.floor(Math.random() * beg.people.length)])
            .setColor(color)
            .setDescription(desc)
            .setFooter(footer));
    }
};
