import Functions from '../../database/models/functions.js';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'setlevel',
	description: 'Set the level of a user.',
	commandType: ['application', 'message'],
	category: 'levels',
	args: [
		{
			name: 'user',
			description: 'The user you want to set the level of.',
			required: true,
			type: 'User',
		},
		{
			name: 'level',
			description: 'The level you want to set.',
			required: true,
			type: 'Number',
		},
	],
	userGuildPermissions: ['MANAGE_MESSAGES'],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		const data = await Functions.findOne({ Guild: ctx.guild!.id });

		if (data && data.Levels == true) {
			const target = await ctx.options.getUser('user', true);
			const level = ctx.options.getNumber('level', true);

			const user = await client.extras.setLevel(target.id, ctx.guild!.id, level);
			if (!user) return;
			client.extras.succNormal(
				{
					text: `Level has been modified successfully`,
					fields: [
						{
							name: '→ New Level',
							value: `${user.level}`,
							inline: true,
						},
						{
							name: '→ User',
							value: `${target} (${target.username + '#' + target.discriminator})`,
							inline: true,
						},
					],
					type: 'reply',
				},
				ctx,
			);
		} else {
			client.extras.errNormal(
				{
					error: 'Levels are disabled in this guild!',
					type: 'reply',
				},
				ctx,
			);
		}
	},
} as CommandOptions;
