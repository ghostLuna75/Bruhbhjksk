const delay = require("delay");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "queueEnd",
  execute(client, player) {
    const channel = client.channels.cache.get(player.textChannel);
    let thing = new MessageEmbed()
      .setColor(client.embedColor)
      .setDescription(` **Music queue ended**`)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });
    channel.send({ embeds: [thing] });
  },
};
