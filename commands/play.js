module.exports = {
    name: "play",
    description: "Reproduces the sound of a Youtube video on the voice channel.",
    execute(message, args, music){
        const ytdl = require('ytdl-core');
        const { voiceChannel } = message.member;
        
        if (!voiceChannel) return message.reply('Please join a voice channel first!');
        try{
            if (voiceChannel.connection != null && voiceChannel.connection.speaking) {
                music.add(args[0])
                return message.channel.send('Video Added!')
            }
        } catch(e){
            console.log(e)
        }
        
        voiceChannel.join().then(connection => {

            var dispatcher = connection;

            try{
                music.add(args[0])
                const stream = ytdl(music.getFirst(), { filter: 'audioonly'});
                dispatcher = connection.playStream(stream);
                message.channel.send(`Playing Video!`)
                
            } catch (e){
                console.log(e)
                return message.channel.send("playlist.title(");
            }

            try{
                dispatcher.on('end', () => {
                    music.removeFirst()
                    if (music.empty()) return message.channel.send("No more videos to play :[");
                    const stream = ytdl(music.getFirst(), { filter: 'audioonly'});
                    dispatcher = connection.playStream(stream);
                    console.log("Song ended")
                });
            } catch (e) {
                console.log
            }
        });
            
    },

}