import welcomeChannel from '../../database/models/welcomeChannels.js';
import { ChannelTypes } from 'discordeno/types';
import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'welcomechannel',
	description: 'Setup the welcomechannel',
	commandType: ['application', 'message'],
	category: 'autosetup',
	args: [],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const channel = await client.helpers.createChannel(ctx.guild!.id!, {
			name: 'Welcome',
			type: ChannelTypes.GuildText,
		});

		client.extras.createChannelSetup(welcomeChannel, channel, ctx);
	},
} as CommandOptions;
