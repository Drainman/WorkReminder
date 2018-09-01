/**************************************************/
/*************** CLASS : Schedule *****************/
/**************************************************/

class Schedule {

    /**
     * @desc Schedul Class Constructor.
     */
    constructor() 
    {
        this.homeWorkList = [];
    }
    
    /**
     * @desc Add a homework in the Schedule (list)
     */
    add_homework(homework)
    {
        this.homeWorkList[this.homeWorkList.length] = homework;
    }
    
    /**
     * @desc Build an embeded message containing all homeworks
     * @param Client client Discord Client
     * @param Message msg Message who called this functions
     * @return Embed The embed message ready to send.
     */
    getEmbedHomeWorkList(client,msg){}

    
    /**
     * @desc Build a string contain the list of homeworks like this : ID[id] -> name
     * @return String the string built
     */
    buildStringHomeWorks()
    {
        var str = '';
        for(var i=0;i<this.homeWorkList.length;i++)
            str += "**ID["+i+"]** -> "+this.homeWorkList[i].name+"\n";
         return str;
    } 
    
    /**
     * @desc Build a list of all homeworks which have a reminder like the date given
     * @param Date dateRef the date use to compare with reminders
     * @return Array The list built
     */
    getHomeWorkByReminder(dateRef)
    {
        var hwListToReminds = [];
        for(var i=0;i<this.homeWorkList.length;i++)
        {
            var reminders = this.homeWorkList[i].reminderList;
            //For all reminders
            for(var j=0;j<reminders.length;j++)
            {
                if(reminders[j].toDateString() == dateRef.toDateString())
                    hwListToReminds[i.toString()] = this.homeWorkList[i]                  
            }
        }
        return hwListToReminds;
    }


}


exports.Schedule = Schedule;

