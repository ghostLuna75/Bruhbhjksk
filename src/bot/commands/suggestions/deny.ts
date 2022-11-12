import Schema from '../../database/models/suggestionChannels.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'deny',
	description: 'Deny a suggestion',
	commandType: ['application', 'message'],
	category: 'suggestions',
	args: [
		{
			name: 'id',
			description: 'The id of the suggestion message',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const messageID = ctx.options.getString('id', true);

		const data = await Schema.findOne({ Guild: ctx.guildId });
		if (data) {
			const suggestionchannel = await client.cache.channels.get(BigInt(data.Channel));
			const suggestEmbed = await client.helpers.getMessage(suggestionchannel.guildId, messageID);
			const embedData = suggestEmbed.embeds[0];

			client.extras.embed(
				{
					title: `Suggestion denied`,
					desc: `\`\`\`${embedData.description}\`\`\``,
					color: client.extras.config.colors.error,
					author: {
						name: embedData.author.name,
						iconURL: embedData.author.iconUrl,
					},
					type: 'edit',
				},
				suggestEmbed,
			);

			try {
				const user = await client.cache.users.get(
					BigInt(
						embedData.author.name.substring(
							embedData.author.name.lastIndexOf('(') + 1,
							embedData.author.name.lastIndexOf(')'),
						),
					),
				);

				if (user) {
					client.extras
						.embed(
							{
								title: `Suggestion denied`,
								desc: `Your suggestion in ${ctx.guild.name} has been denied by a moderator!`,
								fields: [
									{
										name: `→ Suggestion`,
										value: `${embedData.description}`,
									},
								],
							},
							user,
						)
						.catch();
				}
			} catch {
				//fix lint error
			}

			client.extras.succNormal(
				{
					text: 'Suggestion successfully denied',
					fields: [
						{
							name: `→ Suggestion`,
							value: `${embedData.description}`,
						},
					],
					type: 'editreply',
				},
				ctx,
			);
		} else {
			client.extras.errNormal(
				{
					error: `No suggestion channel set! Please do the setup`,
					type: 'editreply',
				},
				ctx,
			);
		}
	},
};
