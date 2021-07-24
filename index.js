//anti alt bot made by ant and legend >:D
const Client = require('./Structures/AntiAltClient.js');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Client({
	disableMentions: 'everyone'
});
const db = require('quick.db');

client.loadCommands();

console.log('-------------------------------------');
console.log('[CREDITS]: made by ant#0768 & legendjs#0001');
console.log('-------------------------------------');

client.on('ready', () => {
	console.log(`[INFO]: Ready on client (${client.user.tag})`);
	console.log(
		`[INFO]: watching ${client.guilds.cache.size} Servers, ${
			client.channels.cache.size
		} channels & ${client.users.cache.size} users`
	);
	console.log('-------------------------------------');
	client.user.setActivity('AntiAlt bot by ant and legendjs :D', {
		type: 'WATCHING'
	});
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.members.fetch(message);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) command.run(client, message, args, db);
});

client.on('guildMemberAdd', async member => {
	let { guild, user } = member;
	let age = db.get(`age.${guild.id}`);
	let logs = db.get(`logs.${guild.id}`);
	let punishment = db.get(`punishment.${guild.id}`);
	let bypassed = db.get(`bypass.${guild.id}`);
	if (bypassed && bypassed.includes(user.id)) return;
	if (Date.now() - user.createdTimestamp > age) {
		member[punishment](
			`Alt detected - Account younger than ${client.decodeMs(age)}`
		);
		let channel = await client.channels.fetch(logs);
		let embed = new discord.MessageEmbed()
			.setTitle(`Suspicious! Account age less than ${client.decodeMs(age)}`)
			.addField(`Member Username`, member.toString() + ` - ${user.tag}`)
			.addField(`Member ID`, user.id)
			.addField(
				`Account Age`,
				client.decodeMs(Date.now() - user.createdTimestamp)
			)
      .addField(`Punishment`, punishment)
			.setColor('#FF0000')
			.setFooter(
				guild.name + ' | Made by ant#0768 & legendjs#0001',
				guild.iconURL({ dynamic: true })
			);
		if (channel) channel.send({ embed: embed });
	}
});

client.login(token).catch(err => {
	console.log('[ERROR]: Invalid Token Provided');
});
