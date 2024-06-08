const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'menu',
    description: 'Show available commands',
    usage: '.menu [command_name]',
    author: 'Gifted Tech',
    category: 'Utility',
    role: 0,
    cooldown: 0,
    usePrefix: true
  },
  onStart: async function ({ msg, bot, match }) {
    try {
      const commandsDir = path.join(__dirname, '.');
      const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

      const categories = {};
      const commands = {};
      const categorizedCommand = {};

      for (const file of files) {
        const command = require(path.join(commandsDir, file));
        const category = command.config.category || 'Uncategorized';

        if (!categories[category]) {
          categories[category] = [];
          categorizedCommand[category] = [];
        }

        categories[category].push(command.config.name);
        commands[command.config.name] = command.config;
        categorizedCommand[category].push(command.config.name);
      }

      if (match && match[1] && match[1].trim()) {
        const commandName = match[1].trim().toLowerCase();
        const commandConfig = commands[commandName];

        if (commandConfig) {
          let commandInfo = `─── NAME ────⭓\n\n» ${commandConfig.name}\n\n─── INFO ────⭓\n\n» Description: ${commandConfig.description || 'Do not have'}\n» Role: ${commandConfig.role}\n» Author: ${commandConfig.author || 'Unknown'}\n» Cooldown: ${commandConfig.cooldown}\n» Use Prefix: ${commandConfig.usePrefix}\n\n─── USAGE ────⭓\n\n» ${commandConfig.usage || `/${commandConfig.name}`}\n\n───────⭔`;
          await bot.sendMessage(msg.chat.id, commandInfo, { parse_mode: 'markdown' });
        } else {
          await bot.sendMessage(msg.chat.id, `Command '${commandName}' not found.`);
        }
      } else {
        let helpMessage = '';

        for (const category in categorizedCommand) {
          helpMessage += `╭══ 〘〘 ɢɪғᴛᴇᴅ-ᴍᴅ 〙〙 ═⊷\n`;
          helpMessage += "┃❍  ᴏᴡɴᴇʀ: Gifted Tech\n";
          helpMessage += "╰════════════════⊷\n\n";
          helpMessage += `╭──ᴛʜɪs ɪs ᴠᴇʀsɪᴏɴ 1.0.0\n\n`;
          helpMessage += `╭──✧『 ${category} 』✧\n`;
          helpMessage += `✧.${categorizedCommand[category].join('✧.')}\n`;
          helpMessage += "╰───────────⊷\n";
        }

        await bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'markdown' });
      }
    } catch (error) {
      console.error('Error generating menu message:', error);
      await bot.sendMessage(msg.chat.id, 'An error occurred while generating the menu message.');
    }
  }
};