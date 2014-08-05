var mainLayer = cc.Layer.extend ({
	bgVelocity: 10,
	bgLifeTime: 0,
	newBgDeltaTime: 0,
	lastNewBgTime: 0,
	bgLayer: null,
	battleLayer: null,
	uiLayer:null,
	
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		
		var d = new Date();

		var size = cc.director.getWinSize();
		this.bgLayer = cc.Layer.create();
		this.addChild(this.bgLayer);

		var sprite1 = cc.Sprite.create(res.Bg_png);
		sprite1.attr({
			anchorX: 0,
			anchorY: 0,
		});
		this.bgLayer.addChild(sprite1, 0);
		this.newBgDeltaTime = sprite1.width/this.bgVelocity;
		
		var move = cc.MoveTo.create(this.newBgDeltaTime, cc.p(-(sprite1.width),0));
		sprite1.runAction(move);
		
		this.schedule(this.updateBg, 1/60);
		this.battleLayer = BattleLayer.create();
		this.addChild(this.battleLayer);
		
		this.uiLayer = UILayer.create();
		this.addChild(this.uiLayer);
		this.uiLayer.ship = this.battleLayer.ship;
		return true;
	},
	
	updateBg:function() {
		var d = new Date();
		var timeNow = d.getTime();
		var deltaTime = timeNow - this.lastNewBgTime;
//		cc.log(deltaTime);
		if (deltaTime >= this.newBgDeltaTime*1000 - 1/30*1000) {
			var size = cc.director.getWinSize();
			var sprite2 = cc.Sprite.create(res.Bg_png);
			sprite2.attr({
				x: size.width,
				anchorX: 0,
				anchorY: 0,
			});
			this.bgLayer.addChild(sprite2, 0);

			var move2 = cc.MoveTo.create((sprite2.width+size.width)*sprite2.scale/this.bgVelocity, cc.p(-(sprite2.width)*sprite2.scale,0));
			var removeBg = cc.CallFunc.create(this.removeBg, this, sprite2);
			sprite2.runAction(cc.Sequence.create(move2, removeBg));
			this.lastNewBgTime = timeNow;
		}
	},
	
	removeBg:function(pSender) {
		this.bgLayer.removeChild(pSender);
	},
	
});

var MainScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new mainLayer();
		this.addChild(layer);
		if (!cc.audioEngine.isMusicPlaying()) {
			cc.audioEngine.playMusic(res.Bgm_universe_mp3, true);
		}
	}
});
