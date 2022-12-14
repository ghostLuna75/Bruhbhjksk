import { CommandOptions, Context } from '@thereallonewolf/amethystframework';

import { AeonaBot } from '../../extras/index.js';

export default {
	name: 'pause',
	description: 'Pause the music',
	commandType: ['application', 'message'],
	category: 'music',
	args: [],

	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel || !ctx.member)
			return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);

		const player = client.extras.player.players.get(ctx.guildId + '');

		if (!client.extras.voiceStates.get(ctx.guildId + '_' + ctx.user.id))
			return client.extras.errNormal(
				{
					error: `You're not in a voice channel!`,
					type: 'reply',
				},
				ctx,
			);

		const channel = await client.helpers.getChannel(
			client.extras.voiceStates.get(ctx.guildId + '_' + ctx.user.id)?.channelId!,
		);

		if (player && channel.id + '' !== player?.voiceChannel)
			return client.extras.errNormal(
				{
					error: `You're not in the same voice channel!`,
					type: 'reply',
				},
				ctx,
			);

		if (!player || !player.queue.current)
			return client.extras.errNormal(
				{
					error: 'There are no songs playing in this server',
					type: 'reply',
				},
				ctx,
			);

		player.pause(true);

		client.extras.succNormal(
			{
				text: `Paused the music!`,
				type: 'reply',
			},
			ctx,
		);
	},
} as CommandOptions;
