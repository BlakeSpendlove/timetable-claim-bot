client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'timetable_claim') {
    await interaction.deferReply({ ephemeral: true });

    const name = interaction.options.getString('name');
    const year = interaction.options.getString('year');
    const subject = interaction.options.getString('subject');
    const room = interaction.options.getString('room');

    // Embed to send in the public channel
    const claimEmbed = new EmbedBuilder()
      .setTitle('📝 Timetable Claim')
      .setColor(0xFF0000)
      .addFields(
        { name: 'Teaching Name', value: name, inline: true },
        { name: 'Year to Teach', value: year, inline: true },
        { name: 'Subject', value: subject, inline: true },
        { name: 'Room', value: room, inline: true }
      )
      .setFooter({ text: ' ', iconURL: process.env.BANNER_URL });

    // Embed to DM the user confirming their claim
    const dmEmbed = new EmbedBuilder()
      .setTitle('✅ Timetable Claim Confirmed')
      .setColor(0x00FF00)
      .setDescription(`Your claim has been posted!\n\n**Name:** ${name}\n**Year:** ${year}\n**Subject:** ${subject}\n**Room:** ${room}`);

    try {
      // Send embed to the claim channel
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      await channel.send({ embeds: [claimEmbed] });

      // DM the user confirming claim
      await interaction.user.send({ embeds: [dmEmbed] });

      // Reply ephemeral in the interaction
      await interaction.editReply('✅ Your claim has been posted and a confirmation DM has been sent!');
    } catch (error) {
      console.error('Error handling claim:', error);
      await interaction.editReply('❌ There was an error processing your claim. Please try again later.');
    }
  }
});
