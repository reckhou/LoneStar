var Energy = cc.Sprite.extend({
	type:GM.ENERGYTYPE.RED,
	xVelocity:GM.ENERGY.XVELOCITY,
	ctor:function(type, startPos) {
		switch (type) {
		case GM.ENERGYTYPE.RED:
			this._super(res.Energy_red_png);
			break;
			
		case GM.ENERGYTYPE.YELLOW:
			this._super(res.Energy_yellow_png);
			break;
			
		case GM.ENERGYTYPE.BLUE:
			this._super(res.Energy_blue_png);
			break;

		default:
			break;
		}
		
		this.x = startPos.x;
		this.y = startPos.y;
		this.scale = 0.5;
		this.type = type;
		return true;
	},
	collideRect:function(x, y) {
		var w = this.width*this.scaleX, h = this.height*this.scaleY;
		return cc.rect(x - w / 2, y - h / 2, w, h);
	}
});