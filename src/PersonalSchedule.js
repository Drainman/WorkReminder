/**************************************************/
/*********** CLASS : PersonalSchedule *************/
/**************************************************/

var Schedule = require('./Schedule.js').Schedule;


class PersonalSchedule extends Schedule {

    /**
     * @desc PersonalSchedule Class Constructor.
     */
    constructor(user) 
    {
        super();
        this.user = user;
    }
    
    /**
     * @desc Build an embeded message containing all homeworks
     * @param Client client Discord Client
     * @param Message msg Message who called this functions
     * @return Embed The embed message ready to send.
     */
    getEmbedHomeWorkList(client,msg)
    {
        var myEmbed =   {embed: {
           color: 0x596CBA,
           author: {
              name: msg.author.username,
              icon_url: msg.author.avatarURL
            },
            title: "My HomeWorks",
            description: "Here we are your personal homeworks :scream:",
            fields: [
              {
                name: ":sob: - HomeWork List",
                value: this.buildStringHomeWorks()
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© DromueBot"
            }
          }
        };
        return myEmbed;
    }

}


exports.PersonalSchedule = PersonalSchedule;

