var g_sharedGameLayer;

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
		g_sharedGameLayer = this;
		var size = cc.director.getWinSize();

		var ship = new Ship(this.gravity, size.height-50, 25);
		this.addChild(ship);
		this.ship = ship;
		this.ship.x = 100;
		this.ship.y = size.height/2;
		this.schedule(this.spawnEnergy, 2);
		this.schedule(this.spawnAstroid, 5);
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
			var energy = new Energy(type, startPos);
	
			this.energyArray.push(energy);
			this.addChild(energy);
			var action = cc.MoveTo.create((screenSize.width + 200)/energy.xVelocity, cc.p(-100, energy.y+(Math.random()*2-1)*200));
			energy.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.removeEnergy, this, energy)));
		}
	},
	spawnAstroid: function() {
		var spawnCnt = Math.floor((Math.random() * 3) + 1);
		for (var i = 1; i <= spawnCnt; i++) {
			var screenSize = cc.director.getWinSize();
//			cc.log("Energy Type: "+type);
			var startPos = cc.p(screenSize.width + 100, Math.floor(Math.random() * (screenSize.height-150)/spawnCnt + (screenSize.height-150)/spawnCnt*(i-1) + 100));
			var astroid = new Astroid(startPos);

			this.astroidArray.push(astroid);
			this.addChild(astroid);
			var action = cc.MoveTo.create((screenSize.width + 200)/astroid.xVelocity, cc.p(-100, astroid.y+(Math.random()*2-1)*200));
			astroid.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.removeAstroid, this, astroid)));
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
		for (var i = 0; i < this.energyArray.length; i++) {
			if (this.collide(this.ship, this.energyArray[i])) {
				var energyType = this.energyArray[i].type;
				
				if (this.ship.lastEnergy == energyType)
				{
					this.ship.combo++;
					this.ship.comboLevel = 1+Math.floor(this.ship.combo/GM.COMBO.PERLEVELCNT);
				} else {
					this.ship.combo = 0;
					this.ship.comboLevel = GM.COMBO.STARTLEVEL;
					this.ship.lastEnergy = energyType;
				}

				this.ship.energyArray[energyType] += this.ship.comboLevel * GM.ENERGY.POWER;
				if (this.ship.energyArray[energyType] > GM.ENERGY.MAX) {
					this.ship.energyArray[energyType] = GM.ENERGY.MAX;
				}
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
		cc.audioEngine.stopMusic();
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
