import ticketSchema from '../../database/models/tickets.js';
import ticketChannels from '../../database/models/ticketChannels.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'notice',
	description: 'Send a inactivity notification.',
	commandType: ['application', 'message'],
	category: 'tickets',
	args: [],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const type = 'reply';

		ticketChannels.findOne({ Guild: ctx.guild!.id, channelID: ctx.channel.id }, async (err, ticketData) => {
			if (ticketData) {
				if (ctx.user!.id !== ticketData.creator) {
					ticketSchema.findOne({ Guild: ctx.guild!.id }, async (err, data) => {
						if (data) {
							const ticketCategory = await client.helpers.getChannel(data.Category);

							if (ticketCategory == undefined) {
								return client.extras.errNormal(
									{
										error: 'Do the setup!',
										type: type,
									},
									ctx,
								);
							}

							if (ctx.channel!.parentId == ticketCategory.id) {
								client.extras.simpleEmbed(
									{
										desc: `Hey <@!${
											ticketData.creator
										}>, \n\nCan we still help you? \nIf there is no response within **24 hours**, we will close this ticket \n\n- Team ${
											ctx.guild!.name
										}`,
										content: `<@!${ticketData.creator}>`,
										type: type,
									},
									ctx,
								);
							} else {
								client.extras.errNormal(
									{
										error: 'This is not a ticket!',
										type: type,
									},
									ctx,
								);
							}
						} else {
							return client.extras.errNormal(
								{
									error: 'Do the setup!',
									type: type,
								},
								ctx,
							);
						}
					});
				} else {
					return client.extras.errNormal(
						{
							error: 'You are not allowed to notice your own ticket!',
							type: 'ephemeral',
						},
						ctx,
					);
				}
			}
		});
	},
} as CommandOptions;
