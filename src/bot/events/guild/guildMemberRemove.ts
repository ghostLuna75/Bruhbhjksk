import { AmethystBot } from '@thereallonewolf/amethystframework';
import { User } from 'discordeno/transformers';
import invitedBy from '../../database/models/inviteBy.js';
import messages from '../../database/models/inviteMessages.js';
import invites from '../../database/models/invites.js';
import leaveSchema from '../../database/models/leaveChannels.js';

export default async (client: AmethystBot, user: User, guildId: bigint) => {
	const messageData = await messages.findOne({ Guild: guildId });
	const inviteByData = await invitedBy.findOne({
		Guild: guildId,
		User: user.id + '',
	});
	const channelData = await leaveSchema.findOne({ Guild: guildId });

	if (inviteByData) {
		const inviteData = await invites.findOne({
			Guild: guildId,
			User: inviteByData.inviteUser,
		});

		if (inviteData) {
			inviteData.Invites -= 1;
			inviteData.Left += 1;
			inviteData.save();
		}

		if (channelData) {
			if (messageData && messageData.inviteLeave) {
				const guild = await client.cache.guilds.get(guildId);
				if (!guild) return;
				let leaveMessage = messageData.inviteLeave;
				leaveMessage = leaveMessage.replace(`{user:username}`, user.username);
				leaveMessage = leaveMessage.replace(`{user:discriminator}`, user.discriminator);
				leaveMessage = leaveMessage.replace(`{user:tag}`, user.username + '#' + user.discriminator);
				leaveMessage = leaveMessage.replace(`{user:mention}`, `<@!${user.id}>`);

				leaveMessage = leaveMessage.replace(`{inviter:mention}`, `<@!${inviteByData.inviteUser}>`);
				leaveMessage = leaveMessage.replace(`{inviter:invites}`, inviteData.Invites + '');
				leaveMessage = leaveMessage.replace(`{inviter:invites:left}`, inviteData.Left + '');

				leaveMessage = leaveMessage.replace(`{guild:name}`, guild.name);
				leaveMessage = leaveMessage.replace(`{guild:members}`, guild.approximateMemberCount + '');

				client.helpers
					.getUser(inviteData.User)
					.then(async (user) => {
						leaveMessage = leaveMessage.replace(`{inviter:username}`, user.username);
						leaveMessage = leaveMessage.replace(`{inviter:discriminator}`, user.discriminator);
						leaveMessage = leaveMessage.replace(`{inviter:tag}`, `${user.username}#${user.discriminator}`);

						const channel = await client.helpers.getChannel(channelData.Channel);

						await client.extras
							.embed(
								{
									title: `👋 Bye`,
									desc: leaveMessage,
								},
								channel,
							)
							.catch();
					})
					.catch(async () => {
						if (channelData) {
							const channel = await client.helpers.getChannel(channelData.Channel);

							await client.extras
								.embed(
									{
										title: `👋 Bye`,
										desc: `**${user.username + '#' + user.discriminator}** has left us`,
									},
									channel,
								)
								.catch();
						}
					});
			} else {
				client.helpers
					.getUser(inviteData.User + '')
					.then(async (user) => {
						const channel = await client.helpers.getChannel(channelData.Channel);

						await client.extras
							.embed(
								{
									title: `👋 Bye`,
									desc: `**${user.username + '#' + user.discriminator}** was invited by ${
										user.username + '#' + user.discriminator
									}`,
								},
								channel,
							)
							.catch();
					})
					.catch(async () => {
						if (channelData) {
							const channel = await client.helpers.getChannel(channelData.Channel);

							await client.extras
								.embed(
									{
										title: `👋 Bye`,
										desc: `**${user.username + '#' + user.discriminator}** was invited by I could not find that person`,
									},
									channel,
								)
								.catch();
						}
					});
			}
		}
	} else {
		if (channelData) {
			const channel = await client.helpers.getChannel(channelData.Channel);

			await client.extras
				.embed(
					{
						title: `👋 Bye`,
						desc: `**${user.username + '#' + user.discriminator}** has left us`,
					},
					channel,
				)
				.catch();
		}
	}
};