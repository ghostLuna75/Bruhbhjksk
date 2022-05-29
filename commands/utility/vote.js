module.exports = {
    name: "vote",
    description: "Vote for aeona",
    usage: "+vote",
    requiredArgs: 0,
    execute: async (message, args, bot, prefix) => {
        await message.channel.send({
            title: "Vote for aeona",
            description: "Vote for aeona on [top.gg](https://top.gg/bot/931226824753700934/vote)\nOnce you're done, check out our site [here](https://aeona.xyz)!"
        })
    }
};