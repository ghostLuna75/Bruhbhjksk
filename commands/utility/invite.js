module.exports = {
  name: "invite",
  description: "Invite aeona to your servers",
  usage: "+invite",
  category: "utility",
  requiredArgs: 0,
  execute: async (message, args, bot, prefix) => {
    await message.channel.send({
      title: "Invite aeona",
      description:
        "Invite me to your servers by clicking [here](https://aeona.xyz)!",
    });
  },
};
