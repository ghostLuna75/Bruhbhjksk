module.exports = {
  name: "giveaway-unpause",
  description: "Unpause a giveaway!",
  aliases: ["gunpause", "unpause-giveaway"],
  usage: "+giveaway-unpause <giveaway id/giveaway prize>",
  category: "giveaways",
  requiredArgs: 1,
  execute: async (message, args, client, prefix) => {
    const query = args.join(" ");
    if (!query)
      return message.channel.send(
        `${message.author}, you need to specify a giveaway ID or prize!`
      );

    const giveaway =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === message.guild.id
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === message.guild.id
      );

    if (!giveaway)
      return message.channel.send(
        `${message.author}, I couldn't find a giveaway with that ID!`
      );

    if (!giveaway.pauseOptions.isPaused)
      return message.channel.send(
        `${message.author}, that giveaway is not paused!`
      );

    client.giveawaysManager.unpause(giveaway.messageId);
  },
};
