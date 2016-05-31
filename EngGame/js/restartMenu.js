function rpreload() {
    game.load.image('skull', 'assets/skull.png');
    game.load.image('button', 'assets/button.png');
}
function random(high,low) {
    high++;
    return Math.floor((Math.random())*(high-low))+low;
}
var questions = [//A-0, B-1, C-2, D-3
    ["When is Independence Day Celebrated?", "4th July", "6th July", "4th May", "1st June", 0],
    ["Who wasn't a member of Comitee of Five?", "Roger Sherman", "Thomas Jefferson", "Benjamin Franklin", "Adam Johns", 3],
    ["Which congress voted for independence of the USA?", "1st Continental", "2nd Continental", "2nd Federal", "International", 1],
    ["What was voted on July 2?", "USA constitution", "Making America great again", "Declaration of Independence", "true", 2],
    ["How many stripes does the USA flag have?", "13", "12", "50", "2", 0],
    ["How many stars does the USA flag have?", "3", "12", "10", "50", 3],
    ["When was current USA flag adopted?", "in 2000", "in 1777", "in 1960", "in 1860", 2],
    ["Which country American fight for independence?", "Great Britain", "Poland", "Germany", "Canada", 0],
    ["Who uses the Great Seal?", "US president", "US goverment", "Comitee of Five", "Every American", 1]
];

var buttons=[];
var t=[];
var question;
var menu;
var answered;
var bar;
var respawnText;

function rcreate() {
    menu = game.add.group();

    question = questions[random(0, questions.length-1)];

    var skull = game.add.sprite(game.width/2, game.height/2-120, 'skull');
    skull.anchor=new Phaser.Point(0.5,0.5);
    menu.add(skull);
    skull.fixedToCamera = true;

    respawnText = game.add.text(game.width/2, game.height/2-20, question[0], { font: '20px Arial', fill: '#fff' });
    respawnText.anchor=new Phaser.Point(0.5,0.5);
    respawnText.fixedToCamera = true;
    respawnText.inputEnabled=true;
    menu.add(respawnText);

    bar = game.add.sprite(game.width/2, game.height/2+20, 'button');
    bar.height=37;
    bar.anchor=new Phaser.Point(0.5,0.5);
    menu.add(bar);
    bar.fixedToCamera = true;

    var bw=0;
    var bh=0;
    var padding = 10;
    for (b = 0; b < 4; b++) { 
        var xi=0;
        var yi=0;
        if (b<2){
            xi=b;
        } else {
            xi=b-2;
            yi=1;
        }
        var bx = game.width/2+xi*(bw+padding);
        var by = game.height/2+90+yi*(bh+padding);
        buttons[b] = game.add.button(bx, by, 'button', buttonHandler);
        buttons[b].anchor=new Phaser.Point(0.5,0.5);
        bw=buttons[b].width;
        bh=buttons[b].height;
        buttons[b].x-=bw/2+padding;
        t[b] = game.add.text(buttons[b].x, buttons[b].y, String.fromCharCode(65+b)+": "+question[b+1],  {font: "14px Arial", fill: "#000", align: "left"});
        t[b].anchor=new Phaser.Point(0.5,0.5);
        menu.add(buttons[b]);
        menu.add(t[b]);
        buttons[b].fixedToCamera = true;
        t[b].fixedToCamera = true;
    }
    menu.visible=false;
    answered=true;
}

function buttonHandler (){
    if (!answered) {
        this.tint="0xff0000"
       select(buttons.indexOf(this)==question[5]);
         //alert("You clicked button "+buttons.indexOf(this));
    }
}

function rupdate() {
    if(!answered){
        bar.width-=game.time.elapsed*0.02;
        if (bar.width<0){
            bar.width=0;
            select(false);
        }
    }
}

var rshowed=false;

function select (a){
    buttons[question[5]].tint="0x00ff00";
    game.time.events.add(Phaser.Timer.SECOND/2, function() {
        var t=game.add.tween(menu).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        t.onComplete.add(function(){
            menu.visible=false;
            rshowed=false;
        });
        respawn(a);
    }, this);
    answered=true;        
}

function rshow () {
    question = questions[random(0, questions.length-1)];
    respawnText.text=question[0];
    rshowed=true;
    menu.visible=true;
    menu.alpha=1;
    answered=false;
    game.tweens.removeAll();
    bar.width=1.5*220;
    for (b = 0; b < 4; b++) { 
        buttons[b].tint="0xffffff"
        t[b].text=question[b+1];
    }
}

function respawn(toLast){
    player.visible=true;
    if (toLast){
        player.position = player.respawnPoint;
        console.log("to last");
    } else {
        player.position.x = navigation.getAt(0).x;
        player.position.y = navigation.getAt(0).y;

        console.log("to begin "+navigation.getAt(0).position);
    }
    player.body.allowGravity=true;
}