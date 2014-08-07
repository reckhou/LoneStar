var g_sharedBattleLayer;

MAX_CONTAINT_WIDTH = 200;
MAX_CONTAINT_HEIGHT = 200;

var BattleLayer = cc.Layer.extend({
	ship: null,
	gravity: 0.4,
	energyArray:null,
	astroidArray:null,
	gameRestarting:false,
	init:function() {
		this.energyArray = new Array();
		this.astroidArray = new Array();
		g_sharedBattleLayer = this;
		var size = cc.director.getWinSize();

		var ship = new Ship(this.gravity, size.height-GM.SHIP.VBORDERLIMIT*2, GM.SHIP.VBORDERLIMIT);
		this.addChild(ship);
		this.ship = ship;
		this.ship.x = 100;
		this.ship.y = size.height/2;
		this.ship.setInvunerable();
		this.schedule(this.spawnEnergy, 5);
		this.schedule(this.spawnAstroid, 4);
		this.schedule(this.collideCheck, 1/60);
		return true;
	},
	spawnEnergy:function() {
//		var spawnCnt = Math.floor((Math.random() * 3) + 1);
		var spawnCnt = 1;
		for (var i = 1; i <= spawnCnt; i++) {
			var screenSize = cc.director.getWinSize();
			var type = Math.floor((Math.random() * 3));
//			cc.log("Energy Type: "+type);
			var startPos = cc.p(screenSize.width + 100 + Math.floor(Math.random()*400 + 100), Math.floor(Math.random() * (screenSize.height-150)/spawnCnt + (screenSize.height-150)/spawnCnt*(i-1) + 100));
			var endPos = cc.p(-200, Math.random() * screenSize.height - GM.SHIP.VBORDERLIMIT*2 + GM.SHIP.VBORDERLIMIT);
			var energy = new Energy(type, startPos);
	
			this.energyArray.push(energy);
			this.addChild(energy);
			var action = cc.MoveTo.create((screenSize.width + 200)/energy.xVelocity, endPos);
			energy.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.removeEnergy, this, energy)));
		}
	},
	spawnAstroid: function() {
		var spawnCnt = Math.floor((Math.random() * 3) + 1);
		for (var i = 1; i <= spawnCnt; i++) {
			var screenSize = cc.director.getWinSize();
//			cc.log("Energy Type: "+type);
			var startPos = cc.p(screenSize.width + 100, Math.floor(Math.random() * (screenSize.height-150)/spawnCnt + (screenSize.height-150)/spawnCnt*(i-1) + 100));
			var endPos = cc.p(-200, Math.random() * screenSize.height - GM.SHIP.VBORDERLIMIT*2 + GM.SHIP.VBORDERLIMIT);
			var astroid = new Astroid(startPos);
			this.astroidArray.push(astroid);
			this.addChild(astroid);
			var action = cc.MoveTo.create((screenSize.width + 200)/astroid.xVelocity, endPos);
			astroid.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.removeAstroid, this, astroid)));
		}
	},
	spawnEnergyByDestroyAstroid: function(x, y) {
	  var array = new Array();
	  var redCnt = Math.floor(Math.random()*2 + 1);
	  array.push(redCnt);
	  var yellowCnt = Math.floor(Math.random()*2 + 1);
	  array.push(yellowCnt);
	  var blueCnt = Math.floor(Math.random()*2);
	  array.push(blueCnt);
	  var totalCnt = redCnt + yellowCnt+ blueCnt;
	  cc.log("Red: "+redCnt+" Yellow: "+yellowCnt+" Blue: "+blueCnt);
	  var yRange = 200;
	  var spawnCnt = 0;
	  var blowDistance = 150;
	  for (var i = 0; i < array.length; i++) {
	    for(var j = 0; j < array[i]; j++) {
	      var curAngle = (Math.random()*240-120)/totalCnt*spawnCnt*0.017453;
	      var targetX = x + Math.cos(curAngle)*blowDistance;
	      var targetY = y + Math.sin(curAngle)*blowDistance;
	      var energy = new Energy(i, cc.p(x, y));
	      this.addChild(energy);
	      cc.log(curAngle+" "+Math.cos(curAngle)*blowDistance+" "+Math.sin(curAngle)*blowDistance);
	      var easeIn = cc.MoveTo(1.0, cc.p(targetX, targetY)).easing(cc.easeIn(0.2));
	      var wait = cc.DelayTime.create(0.2);
	      var moveOut = cc.MoveTo((targetX+100)/energy.xVelocity, cc.p(-100, targetY));
	      var remove = cc.CallFunc.create(this.removeEnergy, this, energy);
	      energy.runAction(cc.Sequence.create(easeIn, wait, moveOut, remove));
	      this.energyArray.push(energy);
	      spawnCnt++;
	    }
	  }
	},
	removeEnergy:function(pSender) {
		this.removeChild(pSender);
		var idx = this.energyArray.indexOf(pSender);
		if (idx > -1) {
			this.energyArray.splice(idx, 1);
		}
	},
	removeAstroid:function(pSender) {
		this.removeChild(pSender);
		var idx = this.astroidArray.indexOf(pSender);
		if (idx > -1) {
			this.astroidArray.splice(idx, 1);
		}
	},
	// touch
	onEnter:function(){
		this._super();
		cc.registerTargetedDelegate(1, true, this);
	},
	
	onExit:function() {
		this._super();
		cc.unregisterTouchDelegate(this);
	},
	onTouchBegan: function(touch, event){
		this.ship.up();
//		cc.log("Touch began!");
		return true;
	},

	onTouchMoved: function(touch, event) {
		return true;
	},

	onTouchEnded: function(touch, event) {
		this.ship.down();
//		cc.log("Touch ended!");
		return true;
	},
	
	collideCheck: function() {
		if (this.gameRestarting) {
			return;
		}
		if (this.ship.energyArray[GM.ENERGYTYPE.BLUE] <= 0) {
				var gameOver = cc.LabelTTF.create("GAME OVER!", "Arial", "64");
				this.addChild(gameOver);
				var winSize = cc.director.getWinSize();
				gameOver.x = winSize.width/2;
				gameOver.y = winSize.height/2;
				this.schedule(this.restartGame, 3);
				this.gameRestarting = true;
				return;
		}
		
		/* Astroid check */
		if (this.ship.invunerable == false) {
  		for (var i = 0; i < this.astroidArray.length; i++) {
  		  if (this.collide(this.ship, this.astroidArray[i])) {
//  		    cc.log("collide!");
  		    this.ship.damage();
  		    this.spawnEnergyByDestroyAstroid(this.astroidArray[i].x, this.astroidArray[i].y);
  		    this.removeAstroid(this.astroidArray[i]);
  		    break;
  		  }
  		}
		}
		
		/* Energy check */
		for (var i = 0; i < this.energyArray.length; i++) {
			if (this.collide(this.ship, this.energyArray[i])) {
				var energyType = this.energyArray[i].type;
				
				this.ship.consumeEnergy(energyType);
				this.energyArray[i].stopAllActions();
				this.removeEnergy(this.energyArray[i]);
			}
		}
	},
	collide:function (a, b) {
		var ax = a.x, ay = a.y, bx = b.x, by = b.y;
		if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
			return false;

		var aRect = a.collideRect(ax, ay);
		var bRect = b.collideRect(bx, by);
		return cc.rectIntersectsRect(aRect, bRect);
	},
	restartGame:function() {
		cc.director.runScene(new MainScene());
	}
});

BattleLayer.create = function () {
	var sg = new BattleLayer();
	if (sg && sg.init()) {
		return sg;
	}
	return null;
};

BattleLayer.scene = function () {
	var scene = cc.Scene.create();
	var layer = BattleLayer.create();
	scene.addChild(layer, 1);
	return scene;
};
