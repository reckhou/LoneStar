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
	shieldActivate:false,
	energyShield: null,
	laserField: null,
	ctor:function (gravity, yMax, yMin) {
		this._super(res.Ship_png);
		this.scale = 0.5;
		this.gravity = gravity;
		this.anchorY = 0;
		this.anchorX = 0;
		this.yMax = yMax;
		this.yMin = yMin;
		this.schedule(this.update, 1/60);
		this.schedule(this.lowEnergy, 2);
		this.schedule(this.engineRoutine, 0.6);
		this.energyArray = [GM.STARTENERGY.RED, GM.STARTENERGY.YELLOW, GM.STARTENERGY.BLUE];
		this.energyShield = new cc.Sprite.create(res.EnergySheild_png);
		this.addChild(this.energyShield);
		this.energyShield.x = this.width / 2;
		this.energyShield.y = this.height / 2;
		this.energyShield.runAction(cc.FadeOut.create(0.1));
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
		if (this.energyArray[GM.ENERGYTYPE.BLUE] < 30) {
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

	  this.energyArray[energyType] += /*this.comboLevel * */GM.ENERGY.POWER;
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
		return cc.rect(x, y, w, h);
	},
	hit:function(astroidType) {
	  if (this.shieldActivate || this.invunerable) {
	    return;
	  }
	  
	  var damage = GM.ASTROID.DAMAGE;
	  if (astroidType == GM.ASTROID.TYPE.BIG) {
	    damage *= 2;
	  }
	  
	  if (this.energyArray[GM.ENERGYTYPE.YELLOW] >= damage) {
	    this.energyArray[GM.ENERGYTYPE.YELLOW] -= damage;
	    this.setShieldActivate()
	  } else {
//	    var damageBlue = damage - this.energyArray[GM.ENERGYTYPE.YELLOW]; //TODO: Damage to blue is 2X to yellow
//	    this.energyArray[GM.ENERGYTYPE.YELLOW] = 0;
	    this.energyArray[GM.ENERGYTYPE.BLUE] -= damage;
	    this.setInvunerable();
	  }
	},
	setShieldActivate:function() {
	  this.shieldActivate = true;
	  this.energyShield.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.FadeIn.create(0.2), cc.FadeOut.create(0.2))));
	  this.schedule(this.shieldDeactivate, GM.SHIP.INVUNERABLETIME);
	  cc.audioEngine.playEffect(res.Shield_wav);
	},
	shieldDeactivate:function() {
	  this.unschedule(this.shieldDeactivate);
	  this.energyShield.stopAllActions();
	  this.shieldActivate = false;
	  this.energyShield.runAction(cc.FadeOut.create(0.2));
	},
	setInvunerable:function() {
	  this.invunerable = true;
	  this.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.FadeIn.create(0.2), cc.FadeOut.create(0.2))));
	  this.schedule(this.stopInvunerable, GM.SHIP.INVUNERABLETIME);
	  cc.audioEngine.playEffect(res.Damage_wav);
	},
	stopInvunerable:function() {
	  this.stopAllActions();
	  this.unschedule(this.stopInvunerable);
	  this.invunerable = false;
	  this.runAction(cc.FadeIn.create(0.2));
	},
	skillLaser:function() {
	  if (this.laserField != null) {
	    return;
	  }
		this.laserField = new Laser(res.Laser_png);
		this.addChild(this.laserField);
		this.laserField.anchorX = 0;
		this.laserField.x = this.width;
		this.laserField.y = this.height/2;
		this.laserField.scaleX = 5;
		this.laserField.scaleY = 2;
		this.laserField.runAction(cc.Sequence.create(cc.DelayTime.create(1.5), cc.CallFunc.create(this.skillLaserEnd, this, null)));
		this.energyArray[GM.ENERGYTYPE.RED] -= GM.SHIP.LASERTHRESOLD;
		cc.audioEngine.playEffect(res.Laser_wav);
	},
	skillLaserEnd:function() {
	  cc.log("laser end");
	  this.removeChild(this.laserField);
	  this.laserField = null;
	}
});