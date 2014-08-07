var Ship = cc.Sprite.extend({
	status: "down",
	vAcc: 0.8,
	vSpeed:0,
	gravity:0,
	yMax:10000,
	yMin:0,
	energyArray:null,
	combo:0,
	comboLevel:1,
	latestEnergy:null,
	invunerable: false,
	ctor:function (gravity, yMax, yMin) {
		this._super(res.Ship_png);
		this.scaleX = 0.6;
		this.scaleY = 0.5;
		this.gravity = gravity;
		this.anchorY = 0;
		this.anchorX = 0;
		this.yMax = yMax;
		this.yMin = yMin;
		this.schedule(this.update, 1/60);
		this.schedule(this.lowEnergy, 2);
		this.schedule(this.engineRoutine, 1);
		this.energyArray = [GM.STARTENERGY.RED, GM.STARTENERGY.YELLOW, GM.STARTENERGY.BLUE];
		return true;
	},
	update:function(dt) {
//		cc.log(this.status)
			if (this.status =="up") {
				this.limitInBox();
				this.vSpeed += this.vAcc - this.gravity;
				this.y += this.vSpeed;
			} else if (this.status == "down") {
				this.limitInBox();
				this.vSpeed -= this.gravity;
				this.y += this.vSpeed;
			} else if (this.status == "stable") {
				this.vSpeed = 0;
			}
//		cc.log(this.vSpeed);

		// notify UI
		g_sharedUILayer.updateShipData();
	},
	lowEnergy:function() {
		if (this.energyArray[GM.ENERGYTYPE.BLUE] < 15) {
		  g_sharedUILayer.warningLabel.visible = true;
			cc.audioEngine.playEffect(res.Low_energy_wav, false);
			return;
		} else {
		  g_sharedUILayer.warningLabel.visible = false;
		}
	},
	engineRoutine:function() {
	  this.energyArray[GM.ENERGYTYPE.BLUE] -= 1;
	},
	consumeEnergy:function(energyType) {
	  if (this.lastEnergy == energyType)
	  {
	    this.combo++;
	    this.comboLevel = 1+Math.floor(this.combo/GM.COMBO.PERLEVELCNT);
	  } else {
	    this.combo = 0;
	    this.comboLevel = GM.COMBO.STARTLEVEL;
	    this.lastEnergy = energyType;
	  }

	  this.energyArray[energyType] += this.comboLevel * GM.ENERGY.POWER;
	  if (this.energyArray[energyType] > GM.ENERGY.MAX) {
	    this.energyArray[energyType] = GM.ENERGY.MAX;
	  }
	  
	  switch (energyType) {
	    case GM.ENERGYTYPE.RED:
	      cc.audioEngine.playEffect(res.Energy_red_mp3);
	      break;
	      
	    case GM.ENERGYTYPE.YELLOW:
	      cc.audioEngine.playEffect(res.Energy_yellow_mp3);
	      break;
	      
	    case GM.ENERGYTYPE.BLUE:
	      cc.audioEngine.playEffect(res.Energy_blue_wav);
	      break;
	  }
	    
	  
	},
	up:function() {
		this.status = "up";
	},
	down:function() {
		this.status = "down";
	},
	stable:function() {
		this.status = "stable";
	},
	isInbound:function() {
		if (this.y <= this.yMax && this.y >= this.yMin) {
//			cc.log("true");
			return true;
		}
//		cc.log("false");
		return false;
	},
	limitInBox:function() {
		if (!this.isInbound()) {
//			cc.log("limit!");
			this.vSpeed = 0;
			if (this.y > this.yMax) {
				this.y = this.yMax;
			} else if (this.y < this.yMin) {
				this.y = this.yMin;
			}
		}
	},
	collideRect:function(x, y) {
		var w = this.width*this.scaleX, h = this.height*this.scaleY;
		return cc.rect(x, y, w, h*0.9);
	},
	damage:function(astroidType) {
	  this.setInvunerable();
	  cc.audioEngine.playMusic(res.Damage_wav, false);
	  var damage = GM.ASTROID.DAMAGE;
	  if (astroidType == GM.ASTROID.TYPE.BIG) {
	    damage *= 2;
	  }
	  
	  if (this.energyArray[GM.ENERGYTYPE.YELLOW] >= damage) {
	    this.energyArray[GM.ENERGYTYPE.YELLOW] -= damage;
	  } else {
	    var damageBlue = damage - this.energyArray[GM.ENERGYTYPE.YELLOW]; //TODO: Damage to blue is 2X to yellow
	    this.energyArray[GM.ENERGYTYPE.YELLOW] = 0;
	    this.energyArray[GM.ENERGYTYPE.BLUE] -= damageBlue;
	  }
	},
	setInvunerable:function() {
	  this.invunerable = true;
	  this.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.FadeIn.create(0.2), cc.FadeOut.create(0.2))));
	  this.schedule(this.stopInvunerable, GM.SHIP.INVUNERABLETIME);
	},
	stopInvunerable:function() {
//	  cc.log("stopInvunerable!");
	  this.stopAllActions();
	  this.unschedule(this.stopInvunerable);
	  this.invunerable = false;
	  this.runAction(cc.FadeIn.create(0.2));
	},
	skillCompond:function() {
		
	},
	skillDecompose:function() {
		
	},
	skillMine:function() {
		
	},
	skillShieldBlow:function() {
		
	}
});