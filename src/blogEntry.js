"use strict";

class blogEntry {
    constructor(id,title, content,image) {
        this.id= id;
        this.title = title;
        this.content = content;
        this.publicDate = new Date(); //geklappt lol// fürs Image, hmhmhm später...?
        this.comments = [];           // Notice: doesnt show on variables
        this.image = image;
    }
}




module.exports = blogEntry;