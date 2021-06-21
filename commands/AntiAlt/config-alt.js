const Discord = require('discord.js');

module.exports = {
	name: 'config-alt',
	run: async (client, message, args, db) => {
		if (!message.member.hasPermission('MANAGE_GUILD'))
			return message.channel.send(
				`You must have the \`MANAGE_GUILD\` permission in order to execute the command.`
			);
		let option = args[0];
		let options = ['punishment', 'age', 'logs', 'show'];
		if (!option)
			return message.channel.send(
				`:x: | The option argument must be one of:\n **${options.join(', ')}**`
			);
		function check(opt) {
			return options.includes(opt);
		}
		if (!check(option.toLowerCase())) {
			return message.channel.send(':x: | **The provided option is invalid**');
		}
		switch (option.toLowerCase()) {
			case 'punishment':
				const punishment = args[1].toLowerCase().trim();
				const punishments = ['kick', 'ban'];
				if (!punishment)
					return message.channel.send('Please enter a punishment');
				if (!punishments.includes(punishment))
					return message.channel.send(
						`The **punishment** argument must be one of these:\n${punishments
							.map(x => `**${x}**`)
							.join(', ')}`
					);
				client.db.set(`punishment.${message.guild.id}`, punishment);
				return message.channel.send(
					`The punishment for **${
						message.guild.name
					}** has been set to: **${punishment}**`
				);
				break;
			case 'age':
				const age = args.slice(1).join(' ');
				const ms = client.parseMs(age);
				if (!ms) return message.channel.send('Invalid time provided.');
				client.db.set(`age.${message.guild.id}`, ms);
				return message.channel.send(
					`The required age has been set to **${age}**`
				);
				break;
			case 'logs':
				const channel = message.mentions.channels.first();
				if (!channel)
					return message.channel.send(':x: | **Specify the channel**');
				client.db.set(`logs.${message.guild.id}`, channel.id);
				return message.channel.send(
					'**The logs channel has been set to** ' + channel.toString()
				);
				break;
			case 'show':
				let logs = db.get(`logs.${message.guild.id}`) || 'None';
				let punish = db.get(`punishment.${message.guild.id}`) || 'None';
				const humanizeDuration = require('humanize-duration');
				let ageee = db.get(`age.${message.guild.id}`) || 0;
				let agee = humanizeDuration(ageee);
				let embed = new Discord.MessageEmbed()
					.setTitle('Anti alt configuration')
					.setAuthor(
						message.author.tag,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.addField(`Punishment`, punish)
					.addField(`Age`, agee)
					.addField(
						`Logs Channel`,
						`${logs !== 'None' ? `<@${logs}>}` : 'None'}`
					)
					.setColor('RANDOM')
					.setFooter(
						message.guild.name + " | Made by ant#0768 & legendjs#0001",
						message.guild.iconURL({ dynamic: true })
					);
				return message.channel.send({ embed: embed });
				break;
		}
	}
};
