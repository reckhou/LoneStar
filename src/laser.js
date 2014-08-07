var Laser = cc.Sprite.extend ({
  ctor : function(fileName) {
    this._super(fileName);
  },
  collideRect:function(x, y) {
    var w = this.width*this.scaleX*this.getParent().scaleX, h = this.height*this.scaleY*this.getParent().scaleY;
    return cc.rect(x, y-h/2, w*0.9, h/2);
  }
});