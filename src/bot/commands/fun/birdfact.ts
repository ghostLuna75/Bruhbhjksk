import fetch from 'node-fetch';

import { CommandOptions, Context } from '@thereallonewolf/amethystframework';
import { AeonaBot } from '../../extras/index.js';
export default {
	name: 'birdfact',
	description: 'Get a random fun bird fact',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [],
	async execute(client: AeonaBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return console.log(ctx.guild + ' ' + ctx.channel + ' ' + ctx.user);
		fetch(`https://some-random-api.ml/facts/bird`)
			.then((res) => res.json())
			.catch()
			.then(async (json: any) => {
				client.extras.embed(
					{
						title: `Random bird fact`,
						desc: json.fact,
						type: 'reply',
					},
					ctx,
				);
			})
			.catch();
	},
} as CommandOptions;
