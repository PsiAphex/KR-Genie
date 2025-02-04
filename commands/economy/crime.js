import { MessageEmbed } from 'discord.js';
import { emotes, crime } from '../../data/index.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { addXP } from '../../modules/db/levels.js';

export default {
    name: 'crime',
    aliases: ['crime'],
    cooldown: 900,
    description: `A command to bag good amount of ${emotes.kr}. Beware with great rewards comes great risks. There is a 10% chance that you will die and lose all your coins, 40% chance of failure and 50% chance of success`,
    expectedArgs: 'k/crime',
    execute: async(message) => {
        // if (!devs.includes(message.author.id)) return message.reply(createEmbed(message.author, 'RED', 'This command is temporarily disabled for maintenance'));
        const { wallet, bank } = await db.utils.balance(message.author.id);
        const netWorth = parseInt(wallet + bank);
        if (netWorth < 0)
            return message.reply(createEmbed(message.author, 'RED', 'Bro you\'re already broke...I can\'t let you do this'));
        const tenth = parseInt(Math.ceil(netWorth / 10));
        const res = Math.floor(Math.random() * 100);
        let desc, footer, kr, color;
        if (res <= 10) {
            desc = crime.responses['death-response'][Math.floor(Math.random() * crime.responses['death-response'].length)];
            footer = 'notstonks4u';
            color = 'RED';
            kr = -parseInt(wallet);
        } else if (res > 50 && res <= 100) {
            const favourableresponse = crime.responses['favourable-response'][Math.floor(Math.random() * crime.responses['favourable-response'].length)];
            const randomKR = parseInt(Math.floor(Math.random() * 5000) + 5000);
            desc = `${favourableresponse.replace('[kr]', `${emotes.kr}${comma(randomKR)}`)}`;
            footer = 'stonks4u';
            color = 'GREEN';
            kr = randomKR;
        } else if (res > 10 && res <= 50) {
            const favourableresponse = crime.responses['non-favourable-response'][Math.floor(Math.random() * crime.responses['non-favourable-response'].length)];
            let randomKR;
            let fine;
            if (netWorth >= 10000)
                fine = Math.ceil(500);
            else if (netWorth < 10000)
                fine = tenth;
            const resp = parseInt(Math.floor(Math.random() * fine) + 500);
            // eslint-disable-next-line prefer-const
            randomKR = resp;
            kr = -randomKR;
            color = 'RED';
            desc = `${favourableresponse.replace('[kr]', `${emotes.kr}${comma(randomKR)}`)}`;
            footer = 'notstonks4u';
        }
        if (kr)
            await db.utils.addKR(message.author.id, kr);
        message.reply(
            new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(color)
                .setDescription(desc)
                .setFooter(footer),
        );
        addXP(message.author.id, 23, message);
    }
};
