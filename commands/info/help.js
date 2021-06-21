const Discord = require('discord.js');

module.exports = {
	name: 'help',
	run: async (client, message, args) => {
		const embed = new Discord.MessageEmbed()
			.setTitle(client.user.username + ` | Help`)
			.setThumbnail(client.user.displayAvatarURL())
			.addField(`Anti Alt`, '`config-alt` | `bypass-alt` | `fetch-alts`')
			.setDescription(`**The commands are listed below**`)
			.setColor(`GREEN`)
			.setFooter(message.guild.name + " | Made by ant#0768 & legendjs#0001", message.guild.iconURL({ dynamic: true }));
		return message.channel.send({ embed: embed });
	}
};
