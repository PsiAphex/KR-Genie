import fs from 'fs';
import readline from 'readline';
import { MessageEmbed } from 'discord.js';
import core from '../../data/JSON/core.json';
const { embed } = core;
export default {
    name: 'changes',
    aliases: ['update', 'updates', 'changelog'],
    cooldown: 5,
    description: 'Shows the latest updates made to the bot',
    expectedArgs: 'k/info',
    execute: async(message, _, bot) => {
        const changesArr = [];
        processLineByLine().then(() => {
            const msgembed = new MessageEmbed()
                .setColor(embed)
                .setFooter('The above log only shows the major updates')
                .setAuthor('KR Genie Change Logs', bot.user.displayAvatarURL());
            const txt = changesArr.join('\n');
            msgembed.setDescription(`\`\`\`asciidoc\n${txt}\`\`\``);
            msgembed.addField('Latest Source', `[Click Here](${core.git['KR-genie']})`);
            message.channel.send(msgembed);
        });

        async function processLineByLine() {
            const fileStream = fs.createReadStream('change-log.txt');

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            for await (const line of rl)
                changesArr.push(line);
        }
    }
};

