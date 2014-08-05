var g_sharedUILayer;

var UILayer = cc.Layer.extend({
	ship: null,
	energyLabel: null,
	typeLabel: null,
	init:function() {
		this.energyLabel = cc.LabelTTF.create("RED:20 / YELLOW:20 / BLUE:20", "Arial", 32);
		this.addChild(this.energyLabel);
		this.energyLabel.anchorX = 1;
		this.energyLabel.anchorY = 0;
		var winSize = cc.director.getWinSize();
		this.energyLabel.x = winSize.width;
		this.energyLabel.y = 0;
		this.typeLabel = cc.LabelTTF.create("N/A", "Arial", 32);
		this.typeLabel.anchorX = 1;
		this.typeLabel.anchorY = 0;
		this.typeLabel.x = winSize.width;
		this.typeLabel.y = this.energyLabel.height;
		this.addChild(this.typeLabel);
		g_sharedUILayer = this;
		return true;
	},
	
	updateShipData: function() {
		if (this.ship == null) {
			return;
		}
		this.energyLabel.string = "RED:"+this.ship.energyArray[0]+" / YELLOW:"+this.ship.energyArray[1]+" / BLUE:"+this.ship.energyArray[2];
		var typeStr = "TYPE: ";
		switch (this.ship.type) {
		case GM.ENERGYTYPE.RED:
			typeStr += "RED";
			break;
			
		case GM.ENERGYTYPE.YELLOW:
			typeStr += "YELLOW";
			break;
			
		case GM.ENERGYTYPE.BLUE:
			typeStr += "BLUE";
			break;

		default:
			break;
		}
		typeStr += " Combo: "+this.ship.combo+" Level: "+this.ship.comboLevel;
		this.typeLabel.string = typeStr;
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
