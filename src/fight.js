const { RichEmbed } = require('discord.js');
const deadText = require("./deadtexts")

class Fight {
    constructor(aname, ahp, amaxhp, aattack, dname, dhp, dmaxhp, ddef, dbonus, dretal, dfort) {
        this.aname = aname
        this.ahp = ahp;
        this.amaxhp = amaxhp;
        this.aattack = aattack;
        this.dname = dname;
        this.dhp = dhp;
        this.dmaxhp = dmaxhp;
        this.ddef = ddef;
        this.dbonus = dbonus;
        if(dname.startsWith("Mooni") || dname.startsWith("Mind Bender"))
            this.dretal = false;
        else
            this.dretal = dretal;
        this.aforce = this.aattack*this.ahp/this.amaxhp;
        this.dforce = this.ddef*this.dhp/this.dmaxhp*this.dbonus;
    }
//-------------------------------------------------------------------------------------
//--------------provideAttHP | .kill gi 32, def w ?------------------------------------
//-------------------------------------------------------------------------------------
    provideAttHP() {
        var totaldam;
        this.dhp = this.dmaxhp
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
        for(var defdiff = 0;this.dhp > 0;this.dhp--) {
            this.dforce = this.ddef*this.dhp/this.dmaxhp*this.dbonus;
            totaldam = this.aforce+this.dforce;
            defdiff = Math.round(this.aforce / totaldam * this.aattack * 4.5);
            if(this.dhp - defdiff <= 0)
                break
        }
        if(this.dhp === 0) {
            console.log("Can't kill")
            helpEmbed.setTitle(`A ${this.ahp}hp ${this.aname} cannot even kill a 1hp ${this.dname}.`)
        } else {
            console.log(`The defender hp required is: ${this.dhp}`)
            helpEmbed
                .setTitle(`The defender hp required for a kill with a ${this.ahp}hp ${this.aname} is:`)
                .addField(`**${this.dname}**:`, `${this.dhp}`)
        }

        return helpEmbed;
    }
//-------------------------------------------------------------------------------------
//--------------provideDefHP | .kill gi ?, def w 8-------------------------------------
//-------------------------------------------------------------------------------------
    provideDefHP() {
        var totaldam;
        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
        for(this.ahp = 0;this.ahp != this.amaxhp;this.ahp++) {
            this.aforce = this.aattack*this.ahp/this.amaxhp;
            var totaldam = this.aforce+this.dforce;
            var defdiff = Math.round(this.aforce / totaldam * this.aattack * 4.5);
            if(this.dhp - defdiff <= 0)
                break
        }
        if(this.ahp === this.amaxhp) {
            console.log("Can't kill")
            helpEmbed.setTitle(`A full hp ${this.aname} cannot kill a ${this.dhp}hp ${this.dname}.`)
        } else {
            console.log(`The min attacker hp required is: ${this.ahp}`)
            helpEmbed
                .setTitle(`The minimum attacker hp required to kill a ${this.dhp}hp ${this.dname} is:`)
                .addField(`**${this.aname}**:`, `${this.ahp}`)
        }

        return helpEmbed;
    }
//-------------------------------------------------------------------------------------
    calculate() {
        let randomText = deadText[Math.floor(Math.random() * deadText.length)];
        var totaldam = this.aforce+this.dforce;
        var defdiff = Math.round(this.aforce / totaldam * this.aattack * 4.5);
        var hpdefender = this.dhp - defdiff;
        let attdiff = 0
        var hpattacker
        if(hpdefender <= 0) {
            hpattacker = this.ahp;
            hpdefender = deadText[Math.floor(Math.random() * deadText.length)];
        } else if(this.dretal === false) {
            hpattacker = this.ahp
            this.aname = this.aname + " (no retaliation)"
        } else {
            attdiff = Math.round(this.dforce / totaldam * this.ddef * 4.5)
            hpattacker = this.ahp - attdiff;
        }

        if(hpattacker <= 0) {
            hpattacker = randomText;
        }
        console.log(`${hpattacker} / ${this.aname}`)
        console.log(`${hpdefender} / ${this.dname}`)
        console.log(`${this.dbonus} / ${this.dretal}`)

        const helpEmbed = new RichEmbed()
            .setColor('#FA8072')
            .setDescription(`The outcome of the fight is:`)
            .addField(`**${this.aname}**:`, `${hpattacker} (${attdiff*-1})`)
            .addField(`**${this.dname}**:`, `${hpdefender} (${defdiff*-1})`)

        if(this.aname === 'Fire Dragon') {
            helpEmbed.addField(`**Splash damage**:`, Math.floor(defdiff/2))
        }

        return helpEmbed;
    }
}

module.exports = Fight;