import { Client, GatewayIntentBits, EmbedBuilder, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const COMMAND = {
  name: 'timetable_claim',
  description: 'Claim a teaching timetable slot',
  options: [
    { name: 'name', type: 3, description: 'Your teaching name', required: true },
    { name: 'year', type: 3, description: 'Year to teach (e.g., Year 10)', required: true },
    { name: 'subject', type: 3, description: 'Subject', required: true },
    { name: 'room', type: 3, description: 'Room (e.g., R2)', required: true }
  ]
};

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(client.user.id), { body: [COMMAND] });
  console.log('✅ Slash command /timetable_claim registered');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== COMMAND.name) return;

  const name = interaction.options.getString('name');
  const year = interaction.options.getString('year');
  const subject = interaction.options.getString('subject');
  const room = interaction.options.getString('room');

  const embed = new EmbedBuilder()
    .setTitle('📝 Timetable Claim')
    .setColor(0xFF0000)
    .addFields(
      { name: 'Teaching Name', value: name, inline: true },
      { name: 'Year to Teach', value: year, inline: true },
      { name: 'Subject', value: subject, inline: true },
      { name: 'Room', value: room, inline: true }
    )
    .setFooter({ text: ' ', iconURL: process.env.BANNER_URL });

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  await channel.send({ embeds: [embed] });
  await interaction.reply({ content: '✅ Your claim has been posted!', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);
