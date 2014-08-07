var g_sharedUILayer;

var UILayer = cc.Layer.extend({
	ship: null,
	energyLabel: null,
	typeLabel: null,
	skillArray: null,
	progressArray: null,
	warningLabel: null,
	init:function() {
		this.energyLabel = cc.LabelTTF.create("RED:20 / YELLOW:20 / BLUE:20", "Arial", 32);
		this.addChild(this.energyLabel);
		this.energyLabel.anchorX = 0;
		this.energyLabel.anchorY = 1;
		var winSize = cc.director.getWinSize();
		this.energyLabel.x = 0;
		this.energyLabel.y = winSize.height;
		
		this.warningLabel = cc.LabelTTF.create("蓝色能量过低!!","Arial", 48);
		this.warningLabel.color = cc.color(0,255,255);
		this.addChild(this.warningLabel);
		this.warningLabel.x = winSize.width/2;
		this.warningLabel.y = winSize.height - 100;
		this.warningLabel.visible = false;
//		this.typeLabel = cc.LabelTTF.create("N/A", "Arial", 32);
//		this.typeLabel.anchorX = 1;
//		this.typeLabel.anchorY = 1;
//		this.typeLabel.x = winSize.width;
//		this.typeLabel.y = this.energyLabel.height;
//		this.addChild(this.typeLabel);
		this.skillArray = new Array();
		var title = cc.LabelTTF.create("test1", "Marker Felt", 16);
		title.color = cc.color(0, 0, 0);
		title.opacity = 0;
		
//		var skill_laser = cc.Sprite.create(res.Skill_laser_jpg);
//		skill_laser.x = winSize.width - 200;
//		skill_laser.y = 50;
//		skill_laser.anchorY = 0;
//		skill_laser.scale = 1.5;
//		this.addChild(skill_laser);
		
		var skill_explosion = cc.Sprite.create(res.Skill_explosion_jpg);
		
		skill_explosion.x = winSize.width - 100;
		skill_explosion.y = 50;
		skill_explosion.anchorY = 0;
		skill_explosion.scale = 1.5;
		this.addChild(skill_explosion);
		g_sharedUILayer = this;
		
		this.progressArray = new Array();
		var pSpriteRed = cc.Sprite.create(res.Bar_png);
		pSpriteRed.setColor(cc.color(255, 0, 0));

		var progressRed = cc.ProgressTimer.create(pSpriteRed);
		progressRed.type = cc.ProgressTimer.TYPE_BAR;
		progressRed.midPoint = cc.p(1, 0);
		progressRed.barChangeRate = cc.p(1, 0);
		this.addChild(progressRed);
		progressRed.x = winSize.width;
		progressRed.y = winSize.height;
		progressRed.percentage = 0;
		progressRed.anchorX = 1;
		progressRed.anchorY = 1;
		this.progressArray.push(progressRed);
		
		var pSpriteYellow = cc.Sprite.create(res.Bar_png);
		pSpriteYellow.setColor(cc.color(255, 255, 0));
		var progressYellow = cc.ProgressTimer.create(pSpriteYellow);
		progressYellow.type = cc.ProgressTimer.TYPE_BAR;
		progressYellow.midPoint = cc.p(1, 0);
		progressYellow.barChangeRate = cc.p(1, 0);
		this.addChild(progressYellow);
		progressYellow.x = winSize.width;
		progressYellow.y = winSize.height - 20;
		progressYellow.percentage = 0;
		progressYellow.anchorX = 1;
		progressYellow.anchorY = 1;
		this.progressArray.push(progressYellow);
		
		var pSpriteBlue = cc.Sprite.create(res.Bar_png);
		pSpriteBlue.setColor(cc.color(0, 0, 255));
		var progressBlue = cc.ProgressTimer.create(pSpriteBlue);
		progressBlue.type = cc.ProgressTimer.TYPE_BAR;
		progressBlue.midPoint = cc.p(1, 0);
		progressBlue.barChangeRate = cc.p(1, 0);
		this.addChild(progressBlue);
		progressBlue.x = winSize.width;
		progressBlue.y = winSize.height - 40;
		progressBlue.percentage = 0;
		progressBlue.anchorX = 1;
		progressBlue.anchorY = 1;
		this.progressArray.push(progressBlue);
		return true;
	},
	
	updateShipData: function() {
		if (this.ship == null) {
			return;
		}
		
		for (var i = 0; i < this.ship.energyArray.length; i++) {
		  this.progressArray[i].stopAllActions();
		  var action = cc.ProgressTo.create(0.1, this.ship.energyArray[i]);
		  this.progressArray[i].runAction(action);
		}
		this.energyLabel.string = "RED:"+this.ship.energyArray[0]+" / YELLOW:"+this.ship.energyArray[1]+" / BLUE:"+this.ship.energyArray[2];
//		var typeStr;
//		typeStr += " Combo: "+this.ship.combo+" Level: "+this.ship.comboLevel;
//		this.typeLabel.string = typeStr;
	}
});

UILayer.create = function () {
	var sg = new UILayer();
	if (sg && sg.init()) {
		return sg;
	}
	return null;
};

UILayer.scene = function () {
	var scene = cc.Scene.create();
	var layer = UILayer.create();
	scene.addChild(layer, 1);
	return scene;
};
