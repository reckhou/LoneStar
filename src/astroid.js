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
		} else {
		  this.type = GM.ASTROID.TYPE.SMALL;
		  this.scale = 0.5;
		}
		this.rotation = Math.random() * 360;
		this.runAction(cc.RepeatForever.create(cc.RotateBy.create(5, -90, -90)));
		this.xVelocity = GM.ASTROID.XVELOCITY + (Math.random()*2-1)*100;
	},
	collideRect:function(x, y) {
	  var w = this.width*this.scaleX, h = this.height*this.scaleY;
	  return cc.rect(x - w / 2 * 0.9, y - h / 2 * 0.9, w * 0.9, h * 0.9);
	},
});