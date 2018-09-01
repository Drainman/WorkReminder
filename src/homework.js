/**************************************************/
/*************** CLASS : HOMEWORK *****************/
/**************************************************/

class Homework {
    
    /**
     * @desc Homework Class Constructor
     * @param String name HomeWork name
     * @param Date dateLim HomeWork's Dead Line
     * @param int priority HomeWork's priority (cf. Docs or makeReminder function)
     */
    constructor(name,dateLim,priority) 
    {
        this.name = name;
        this.dateLim = dateLim;
        this.priority = priority;
        this.description = "No description."
        //Build the reminders & init the reminder
        this.makeReminder();
    }
    
    
    /**
     * @desc Builds reminders according to the priority.
     * [PRIORITY] -> [DATA BEFORE DEAD LINE]
     * 0 -> 1 day
     * 1 -> 1 & 2 day
     * 2 -> All days from 1 week
     * 3 -> 2 week & All days from 1 week
     * 4 -> 1 month, 3 & 2 week & All days from 1 week
     * 5 -> All days from 1 month
     */
    makeReminder() 
    {
        this.reminderList = [];
        
        const DAY_MS = 86400000;
        
        if(this.priority >= 0 && this.priority < 5)
            this.reminderList[0] = new Date(this.dateLim - DAY_MS);
        
        
        if(this.priority >= 1 && this.priority < 5)
            this.reminderList[this.reminderList.length] = new Date(this.dateLim - 2 * DAY_MS);
        
        
        if(this.priority >= 2 && this.priority < 5 )
            for(var i=3;i<= 7;i++)
                this.reminderList[this.reminderList.length] = new Date(this.dateLim - i * DAY_MS);
                
        if(this.priority >= 3 && this.priority < 5 )
            this.reminderList[this.reminderList.length] = new Date(this.dateLim - 14 * DAY_MS);
            
        if(this.priority >= 4 && this.priority < 5)
        {
            this.reminderList[this.reminderList.length] = new Date(this.dateLim - 3 * 7 * DAY_MS);
            this.reminderList[this.reminderList.length] = new Date(this.dateLim - 30 * DAY_MS);
        }
        
        else if(this.priority == 5)
            for(var i=0;i<=30;i++)
                this.reminderList[this.reminderList.length] = new Date(this.dateLim - i * DAY_MS);

    }
    
    
    /**
     * @desc Replace the current description by a new
     * @param String description The new description
     */
    setDescription(description)
    {
        this.description = description;
    }
    
    
    /**
     * @desc Build an Embed message according reminders and context
     * @param Client client Discord client
     * @param User user User who called this function
     * @param boolean isAnAdd true if call when the homework is add, else false
     * @param ~ A Role id if we want reminder refering to a role.
     * @return Embed The embed message.
     */
    getEmedReminder(client,user,isAnAdd,groupId)
    {
        var embedTitle = "";
        var embeddescription = "";
        var embedInfo = '';
        
        //Call after an homework add
        if(isAnAdd)
        {
            embedTitle = "HomeWork Added !";
            embeddescription = "Your homework has been added. :thumbsup:";
        }
        
        //Call with command !consult
        else
        {
            embedTitle = "HomeWork Find !";
            embeddescription = "But... You asked for this :sob:";
        }
        
        //Personal Homework
        if(groupId == null || groupId == undefined || groupId == false)
            embedInfo = ":bookmark: - "+this.name+'\n:warning: - '+this.priority+"\n:calendar_spiral: - "+this.dateLim
        else
            embedInfo = ":handshake: - "+ groupId +"\n"+":bookmark: - "+this.name+'\n:warning: - '+this.priority+"\n:calendar_spiral: - "+this.dateLim
        
        
       var myEmbed =   {embed: {
            color: 0x596CBA,
            author: {
              name: user.username,
              icon_url: user.avatarURL
            },
            title: embedTitle,
            description: embeddescription,
            fields: [{
                name: "Details",
                value: embedInfo
              },
              {
                  name: "Description",
                  value : this.description,
              },
              {
                name: ":alarm_clock: Reminders",
                value: this.buildStringReminder()
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
    
    /**
     * @desc Build a string wich contains all the reminders for the current homework
     * @return String contains the reminders
     */
    buildStringReminder()
    {
        var str = '```';
        for(var i=0;i<this.reminderList.length;i++)
            str += this.reminderList[i] + '\n';
        str += "```";
        return str;
    }
    
}


exports.Homework = Homework;

