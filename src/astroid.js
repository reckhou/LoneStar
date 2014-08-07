var Astroid = cc.Sprite.extend({
	xVelocity:GM.ASTROID.XVELOCITY,
	type:0,
	ctor:function(startPos) {
		this._super(res.Astroid_png);
		this.x = startPos.x;
		this.y = startPos.y;
		var rdm = Math.floor(Math.random()*10);
		if (rdm == 0) {
		  this.type = GM.ASTROID.TYPE.BIG;
		  this.scale = 0.7
		} else {
		  this.type = GM.ASTROID.TYPE.SMALL;
		  this.scale = 0.25;
		}
		this.rotation = Math.random() * 360;
		this.runAction(cc.RepeatForever.create(cc.RotateBy.create(5, -90, -90)));
		this.xVelocity = GM.ASTROID.XVELOCITY + (Math.random()*2-1)*100;
	},
	collideRect:function(x, y) {
	  var w = this.width*this.scaleX, h = this.height*this.scaleY;
	  return cc.rect(x - w / 2*0.8, y - h / 2*0.8, w*0.8, h*0.8);
	},
	eliminate:function(x, y) {
	  var scale = cc.ScaleTo.create(0.2, 0);
	  var clean = cc.CallFunc.create(this.removeFromParentAndCleanup, this, true)
	  this.runAction(cc.Sequence.create(scale, clean));
	  cc.audioEngine.playEffect(res.AstroidExplode_wav);
	}
});