const { MessageEmbed } = require('discord.js'),
    emotes = require('../../data').emotes,
    items = require('../../data/items'),
    comma = require('../../modules/comma');
module.exports = {
    name: 'shop',
    aliases: ['market'],
    execute: async(message, args) => {
        let footer;
        let pageNumber;
        /**
         * Creates an embed with items starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = items.items.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor('KR Market')
                .setDescription(`A place to spend your ${emotes.kr} and get useful items\n\u200b`)
                .setColor('YELLOW')
                .setFooter(footer);
            current.forEach(g => embed.addField(`${g.icon} ${g.name} : ${emotes.kr}${comma(g.price)}`, `${g.description}\n\u200b`));
            return embed;
        };
        if (items.items.length < 10) {
            footer = '1 out of 1';
            message.channel.send(generateEmbed(0));
            return;
        }

        const page = args.shift();
        if (!page) {
            let lastPage = items.items.length / 10;
            if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1;
            footer = `1 out of ${lastPage}`;
            message.channel.send(generateEmbed(0));
        } else {
            let lastPage = items.items.length / 10;
            if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1;
            footer = `${page} out of ${lastPage}`;
            pageNumber = page - 1;
            const currentindex = parseInt(pageNumber * 10);
            console.log(currentindex);
            if (currentindex > items.items.length) return;
            message.channel.send(generateEmbed(currentindex));
        }
    },
};
