const axios = require('axios');

module.exports = {
    config: {
        name: "gpt4",
        author: "Gifted Tech",
        description: "Search response using GPT4",
        category: "ᴀɪ",
        usage: "q",
        usePrefix: true,
        role: 0
    },

    onStart: async function ({ bot, chatId, args }) {
        const input = args.join(' ');
        const [prompt] = input.split('|').map(s => s.trim());

        if (!prompt) {
            bot.sendMessage(chatId, "Please provide your query");
            return;
        }

        try {
            const apiUrl = `https://api.vihangayt.com/ai/chatgpt-4?q=${encodeURIComponent(prompt)}`;
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            await bot.sendMesage(chatId);
        } catch (error) {
            console.error('Error communicating with Api', error);
            bot.sendMessage(chatId, 'Sorry, an error occurred while communicating with gpt4 APi');
        }
    }
};
