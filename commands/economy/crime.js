const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules');

module.exports = {
    name: 'crime',
    cooldown: 1000,
    execute: async(message) => {
        const { wallet } = await db.utils.balance(message.author.id);
        const res = Math.floor(Math.random() * 100);
        let description, footer, kr;
        if (res <= 10) {
            description = data.crime.responses['death-response'][Math.floor(Math.random() * data.crime.responses['death-response'].length)];
            footer = 'notstonks4u';
        } else if (res > 10 && res <= 50) {
            const favourableresponse = data.crime.responses['favourable-response'][Math.floor(Math.random() * data.crime.responses['favourable-response'].length)];
            const randomKR = parseInt(Math.floor(Math.random() * 10000));
            description = `${favourableresponse.replace('[kr]', `${data.emotes.kr}${randomKR}`)}`;
            footer = 'stonks4u';
            kr = randomKR;
        } else if (res > 50 && res <= 100) {
            const favourableresponse = data.crime.responses['non-favourable-response'][Math.floor(Math.random() * data.crime.responses['non-favourable-response'].length)];
            let randomKR;
            const resp = parseInt(Math.floor(Math.random() * wallet));
            if (wallet <= 0) randomKR = 0;
            else randomKR = resp;
            kr = -randomKR;
            description = `${favourableresponse.replace('[kr]', `${data.emotes.kr}${randomKR}`)}`;
            footer = 'stonks4u';
        }
        if (kr) await db.utils.addKR(message.author.id, kr);
        message.reply(
            new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(description)
                .setFooter(footer),
        );
    },
};
