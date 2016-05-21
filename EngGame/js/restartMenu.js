function rpreload() {
    game.load.image('skull', 'assets/skull.png');
    game.load.image('button', 'assets/button.png');
}

var questions = [//A-0, B-1, C-2, D-3
    ["What's the circumference of the moon?", "Yes", "No", "1000m", "Moon is a lie", 3],
    ["What's the sense of life?", "Yes", "There is no", "pi*r^2", "e=mc^2", 1]
];

var buttons=[];
var question;
var menu;
var answered;
var bar;

function rcreate() {
    menu = game.add.group();

    question = questions[game.rnd.integerInRange(0, questions.length-1)];

    var skull = game.add.sprite(game.width/2, game.height/2-120, 'skull');
    skull.anchor=new Phaser.Point(0.5,0.5);
    menu.add(skull);
    skull.fixedToCamera = true;

    var respawnText = game.add.text(game.width/2, game.height/2-20, question[0], { font: '30px Arial', fill: '#fff' });
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
        var t = game.add.text(buttons[b].x, buttons[b].y, String.fromCharCode(65+b)+": "+question[b+1],  {font: "20px Arial", fill: "#000", align: "left"});
        t.anchor=new Phaser.Point(0.5,0.5);
        menu.add(buttons[b]);
        menu.add(t);
        buttons[b].fixedToCamera = true;
        t.fixedToCamera = true;
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
        bar.width-=game.time.elapsed*0.17;
        if (bar.width<0){
            bar.width=0;
            select(false);
        }
    }
    game.debug.text("menu.visible: "+menu.visible, 10, 30 );
    game.debug.text("navigation.getAt(0).x: "+navigation.getAt(0).x, 10, 30+25 );
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
    console.log("show");
    rshowed=true;
    menu.visible=true;
    menu.alpha=1;
    answered=false;
    game.tweens.removeAll();
    bar.width=1.5*220;
    for (b = 0; b < 4; b++) { 
        buttons[b].tint="0xffffff"
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