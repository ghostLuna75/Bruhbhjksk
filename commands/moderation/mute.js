const Logging = require("../../database/schemas/logging.js");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  description: "Mute the specified user",
  usage: "+mute <user> [time] [reason]",
  category: "moderation",
  requiredArgs: 1,
  permissions: ["MODERATE_MEMBERS"],
  botPermissions: ["MODERATE_MEMBERS"],
  execute: async (message, args, bot, prefix) => {
    let logging = await Logging.findOne({ guildId: message.guild.id });
    let mentionedMember =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);

    const msRegex = RegExp(/(\d+(s|m|h|w))/);

    if (!mentionedMember)
      return message.replyError({
        title: "Mute",
        description: "Please provide a user to mute.",
      });
    if (!msRegex.test(args[1]))
      return message.replyError({
        title: "Mute",
        description: "Please provide a valid time.",
      });

    let time = msRegex.exec(args[1])[1];

    if (
      mentionedMember.roles.highest.position >=
      message.guild.me.roles.highest.position
    ) {
      return message.replyError({
        title: "Mute",
        description:
          "I cannot mute a user with a role higher than my highest role.",
      });
    }

    if (!mentionedMember.moderatable)
      return message.replyError({
        title: "Mute",
        description: "I cannot mute this user.",
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = `No reason provided.`;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    let dmEmbed;
    if (
      logging &&
      logging.moderation.mute_action &&
      logging.moderation.mute_action !== "1"
    ) {
      if (logging.moderation.mute_action === "2") {
        dmEmbed = `You've been muted in **${message.guild.name}** for **${time}**`;
      } else if (logging.moderation.mute_action === "3") {
        dmEmbed = `You've been muted in **${message.guild.name} ** for **${time}**\n\n__**Reason:**__ ${reason}`;
      } else if (logging.moderation.mute_action === "4") {
        dmEmbed = `You've been muted in **${message.guild.name}** for **${time}**\n\n__**Moderator:**__ ${message.author} **(${message.author.tag})**\n__**Reason:**__ ${reason}`;
      }

      mentionedMember
        .sendError({
          title: "OH NO",
          description: dmEmbed,
        })
        .catch(() => {});
    }

    mentionedMember.timeout(
      ms(time),
      reason + `/Responsible: ${message.author.tag}`
    );

    message.channel
      .send({
        title: "Mute",
        description: `${mentionedMember} has been muted for ${time}. (${reason})`,
      })
      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      });

    if (logging) {
      if (logging.moderation.delete_after_executed === "true") {
        message.delete().catch(() => {});
      }

      const role = message.guild.roles.cache.get(
        logging.moderation.ignore_role
      );
      const channel = message.guild.channels.cache.get(
        logging.moderation.channel
      );

      if (logging.moderation.toggle == "true") {
        if (channel) {
          if (message.channel.id !== logging.moderation.ignore_channel) {
            if (
              !role ||
              (role &&
                !message.member.roles.cache.find(
                  (r) => r.name.toLowerCase() === role.name
                ))
            ) {
              if (logging.moderation.mute == "true") {
                let color = logging.moderation.color;
                if (color == "#000000") color = message.client.color.red;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Action: \`Mute\` | ${mentionedMember.user.tag} | Case #${logcase}`,
                    mentionedMember.user.displayAvatarURL({ format: "png" })
                  )
                  .setDescription(`**User:** ${mentionedMember}\n **Time:** ${time}\n **Reason:** ${reason}\n **Responsible Moderator:** ${message.author}`)
                  .setFooter({ text: `ID: ${mentionedMember.id}` })
                  .setTimestamp()
                  .setColor(color);

                channel.send({ embed: [logEmbed] }).catch(() => {});

                logging.moderation.caseN = logcase + 1;
                await logging.save().catch(() => {});
              }
            }
          }
        }
      }
    }
  },
};
