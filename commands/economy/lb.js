import utils from '../../modules/messageUtils.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import Paginator from '../../modules/paginate.js';
// eslint-disable-next-line no-unused-vars
import { devs } from '../../data/index.js';


export default {
    name: 'lb',
    cooldown: 2,
    aliases: ['leaderboard', 'leaderboards', 'lbs', 'rich'],
    description: 'A command used to view the richest users of the bot.',
    expectedArgs: 'k/lb\nk/lb --cash',
    execute: async(message, args) => {
        // if (!devs.includes(message.author.id)) return message.reply(utils.createEmbed(message.author, 'RED', 'This command is temporarily disabled for maintenance'));
        const sortByCash = message.content.includes('--cash');
        message.content = message.content.replace('--cash', '');
        const sorter = sortByCash ? (x, y) => x.balance.wallet - y.balance.wallet : (x, y) => x.balance.wallet + x.balance.bank - (y.balance.wallet + y.balance.bank);
        const values = (await db.values()).sort(sorter).reverse();
        const max = Math.ceil(values.length / 10);
        let page; // l = (args[0] || 1);
        if (Number.isInteger(parseInt(args[0]))) page = args[0];
        else page = 1;
        if (page <= 0) return message.reply('Page no. has to be greater than 0, nitwit');
        if (page > max) page = max;

        const paginator = new Paginator(message.client, message.channel, {
            page,
            author: message.author,
            embed: {
                color: 'GREEN',
            },
            max,
            count: 10,
            maxValues: values.length,
        }, async(index, count) => {
            const lbUsers = [];
            for (const i of [...values].splice(index, count)) {
                const bankBal = i.balance.wallet + (sortByCash ? 0 : i.balance.bank);
                const user = await utils.getID(i.id);
                lbUsers.push({ name: user.tag, balance: bankBal });
            }
            return toString(lbUsers, index);
        });
        await paginator.start();
        return new Promise((resolve) => {
            paginator.on('end', resolve);
        });
    },
};
const toString = (users, increment) => users.map((x, i) => `**${Number(i) + 1 + increment}.** ${x.name} - ${comma(x.balance)}`).join('\n');
