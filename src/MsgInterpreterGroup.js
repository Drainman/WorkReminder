/**************************************************/
/********* CLASS : MSGINTERPRETERGROUP ************/
/**************************************************/
var Homework = require('./homework.js').Homework;
var Utils = require('./utils.js').Utils;
var Schedule = require('./Schedule.js').Schedule;
var PersonalSchedule = require('./PersonalSchedule.js').PersonalSchedule;
var GroupSchedule = require('./GroupSchedule.js').GroupSchedule;
var MsgInterpreter = require('./MsgInterpreter.js').MsgInterpreter;
const Discord = require('discord.js');


class MsgInterpreterGroup extends MsgInterpreter {
    
    constructor(client)
    {
        super(client);
        this.commandList = ['!add_hw_g','!consult_hw_g','!del_hw_g','!set_description_g'];
    }
    
    
    /**
     * @desc Interpret a command and execute according functions.
     * COMMAND TYPE
     * ------------------ GROUP COMMAND ------------------
     * - !add_hw_g [GROUP] ~ [name] ~ DD/MM/AAAA ~  [PRIORITY] -> Add a homework for the groupe [GROUP].
     * - !set_description [GROUP] ~ [ID] ~ [DESC] -> Add a description for homework [ID]
     * - !consult_hw_g [GROUP] ~ [OPTIONAL ID] -> Consult group homework.
     * - !del_hw_g [GROUPE] ~ [ID] -> Delete a group homework. 
     * ---------------------- NOTES ----------------------
     * [GROUP] is an object type Discord Role
     * 
     * @param Message msg The message to interpret.
     * @return boolean ~ True if a command has been execute, else false.
     */
    interpretCommand(msg)
    {
        Utils.logMsg("INFO",'Role Command submit -> '+msg.content)
        
        var command = msg.content;
        var splitC = command.split(' ');
        var commandList = this.commandList;
        
        if(commandList.includes(splitC[0]))
        {
            
            /*********************************/
            /************ !add_hw ************/
            /*********************************/
            if(splitC[0] === '!add_hw_g')
            {
                //DELETE COMMAND TAG
                var parameters = msg.content.replace('!add_hw_g ','');
                
                //get each parameters
                var splitNameOther = parameters.split("~");
                var groupId = '';
                var name = '';
                var date_str = '';
                var prio = '';                  
                
                //VERIF IF ALL PARAM ARE DEFINED
                if(splitNameOther[0] == undefined || splitNameOther[1] == undefined || splitNameOther[2] == undefined || splitNameOther[3] == undefined || splitNameOther.length != 4)
                    return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Command Syntax.","The command must be : ```!add_hw_g [GROUP] ~ [name] ~ DD/MM/AAAA ~  [PRIORITY]``` \n"); 
                
                //IT's OK
                else
                {
                    groupId = splitNameOther[0].replace(/\s/g, '');                    
                    name = splitNameOther[1];
                    date_str = splitNameOther[2].replace(/\s/g, '');
                    prio = splitNameOther[3].replace(/\s/g, '');
                } 
                
                //VERIF VALID ROLE
                if(groupId.match(/[0-9]+/)[0] == "" || groupId.match(/[0-9]+/)[0] == undefined) //|| !checkRole() --> Check if the role exist, if it is in this guild and if user try to add this hw have the role
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                    
                //Role Object   
                var role = Utils.getRoleById(msg,groupId.match(/[0-9]+/)[0])
                
                if(!role)
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                //VERIF DATE
                
                else if(Utils.date_validator(date_str))
                {
                    
                    //GROUP DON'T HAVE A SCHEDULE --> We create it
                    if(this.allSchedule[groupId] == undefined)
                        this.allSchedule[groupId] = new GroupSchedule(role);
                    
                     
                     var temp_Hw = new Homework(name,Utils.build_date(date_str),prio); //Object HomeWork
                     this.allSchedule[groupId].add_homework(temp_Hw); //Add in the list
                     
                     //FEED BACK USER
                     msg.reply(this.allSchedule[groupId].homeWorkList[this.allSchedule[groupId].homeWorkList.length-1].getEmedReminder(this.client,this.client.user,true,groupId));
                     return true;
                }
                
                //DATE INVALID
                else
                   return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Date given.","The Date must be : **DD**/**MM**/**AAAA** \n");
                
            }//end !add_hw
            
                        
            /*********************************/
            /********* !consult_hw_g *********/
            /*********************************/
            else if(splitC[0] === '!consult_hw_g')
            {
                //DELETE COMMAND TAG
                var parameters = msg.content.replace('!consult_hw_g ','');
                
                //get each parameters
                var splitNameOther = parameters.split("~");
                var roleId = splitNameOther[0].replace(/\s/g, '');
                //var hwId = '';
                
                //VERIF VALID ROLE
                if(roleId.match(/[0-9]+/)[0] == "" || roleId.match(/[0-9]+/)[0] == undefined) //|| !checkRole() --> Check if the role exist, if it is in this guild and if user try to add this hw have the role
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                
                //ROLE EXIST ?
                else if(!Utils.getRoleById(msg,roleId.match(/[0-9]+/)[0]))
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                                   
                //No homework
                if(this.allSchedule[roleId] == undefined || this.allSchedule[roleId].homeWorkList.length < 1 )
                    return this.embebMediumMessage(msg,"warning","No homework saved", "The role "+roleId+" don't have any homework currently.","You can add a homework with the command : \n ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]```");
                                               
                //No ID details
                else if(splitNameOther.length == 1)
                    msg.reply(this.allSchedule[roleId].getEmbedHomeWorkList(this.client,msg));
               
                //
                else
                {
                    var search_id = splitNameOther[1].replace(/\s/g, '');
                    if(search_id >= this.allSchedule[roleId].homeWorkList.length || this.allSchedule[roleId].homeWorkList[search_id] == undefined )
                         return this.embebSmallMessage(msg,"error","Invalid ID", "You try to access an inexistant homework.");
                         
                    else
                        msg.reply(this.allSchedule[roleId].homeWorkList[search_id].getEmedReminder(this.client,this.client.user,false,roleId));
                }
                    
                return true;                
            }//end !consult_hw_g
            
            
            /*********************************/
            /****** !set_description_g *******/
            /*********************************/           
            else if(splitC[0] === '!set_description_g')
            {
                var parameters = msg.content.replace('!set_description_g ','');    
                var splitParameters = parameters.split("~");
                var roleId = "";var id_edit = "";var desc = "";
     
                //SYNTAX VERIF
                if(splitParameters[0] == undefined || splitParameters[1] == undefined || splitParameters[2] == undefined || splitParameters.length != 3)
                    return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Syntax command.","The command must be : \n ```!set_description [ID] ~ [DESC]```");
                
                
                else
                {
                    roleId = splitParameters[0].replace(/\s/g, '');
                    id_edit = splitParameters[1].replace(/\s/g, '');
                    desc = splitParameters[2];
                }
                
                
                //VERIF VALID ROLE
                if(roleId.match(/[0-9]+/)[0] == "" || roleId.match(/[0-9]+/)[0] == undefined) //|| !checkRole() --> Check if the role exist, if it is in this guild and if user try to add this hw have the role
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                
                //ROLE EXIST ?
                else if(!Utils.getRoleById(msg,roleId.match(/[0-9]+/)[0]))
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                    
                //COHERENCE VERIF
                else if(this.allSchedule[roleId] == undefined || this.allSchedule[roleId].homeWorkList.length < 1 )
                    return this.embebMediumMessage(msg,"warning","No homework saved", "The role "+roleId+" don't have any homework currently.","You can add a homework with the command : \n ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]```");

                
                //INVALID ID
                else if(id_edit >= this.allSchedule[roleId].homeWorkList.length)
                    return this.embebSmallMessage(msg,"warning","Invalid ID", "You try to access an inexistant homework.");
                    
                
                
                //EVERYTHING IS FINE
                else
                {                    
                    this.allSchedule[roleId].homeWorkList[id_edit].setDescription(desc);
                    return this.embebSmallMessage(msg,"info","HomeWork update !", "Oh, thank's more work for me. :expressionless:");
                }
                

            }//end !set_description
            
        
            /*********************************/
            /*********** !del_hw_g ***********/
            /*********************************/           
            else if(splitC[0] === '!del_hw_g')
            {
                var parameters = msg.content.replace('!del_hw_g ','');    
                var splitParameters = parameters.split("~");
                var roleId = "";var id_del = "";
                //PARAM CONTROL
                if(splitParameters[0] == undefined || splitParameters[1] == undefined || splitParameters.length != 2 )
                    return this.embebMediumMessage(msg,"error","Syntax Error", ":warning: Invalid Syntax command.","The command must be : \n ```!del_hw_g [ROLE] ~ [ID]```");
                else
                {
                    roleId = splitParameters[0];
                    id_del = splitParameters[1];
                }
                
                //VERIF VALID ROLE
                if(roleId.match(/[0-9]+/)[0] == "" || roleId.match(/[0-9]+/)[0] == undefined) //|| !checkRole() --> Check if the role exist, if it is in this guild and if user try to add this hw have the role
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                
                //ROLE EXIST ?
                else if(!Utils.getRoleById(msg,roleId.match(/[0-9]+/)[0]))
                    return this.embebSmallMessage(msg,"error","Invalid Role", "The role given is invalid. Please Check it.");
                
                //NO HOMEWORK
                else if(this.allSchedule[roleId] == undefined || this.allSchedule[roleId].homeWorkList.length < 1 )
                    return this.embebMediumMessage(msg,"warning","No homework saved", "The role "+roleId+" don't have any homework currently.","You can add a homework with the command : \n ```!add_hw [NAME] ~ DD/MM/AAAA ~ [PRIORITY]```");
                
                //INVALID ID
                else if(id_del >= this.allSchedule[roleId].homeWorkList.length)
                    return this.embebSmallMessage(msg,"warning","Invalid ID", "You try to delete an inexistant homework.");
                    
                
                //EVERYTHING IS FINE
                else
                {
                    this.allSchedule[roleId].homeWorkList.splice(id_del,0);
                    return this.embebSmallMessage(msg,"info","HomeWork deleted !", "Hey "+roleId +"! Naaaah, it's doesn't matter anyway. :rolling_eyes:");
                    //Ajouter info --> devoir supprimé & utilisateur ayant supprimé
                 }
                    
                     
            }//end !del_hw_g
            
        
        }
        
        //The command is not an interpretable command
        else
            return false;
        
    }

}


exports.MsgInterpreterGroup = MsgInterpreterGroup;