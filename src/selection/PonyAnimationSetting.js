
define(function(require) {
	
	var Surface = famous.core.Surface;
	var SequentialLayout = famous.views.SequentialLayout;
	var InputSurface = famous.surfaces.InputSurface;
	
	function PonyAnimationSetting(options, pony, ponyModel) {
		View.apply(this, arguments);
		
		this._options = options;
		this._pony = pony;
		this._ponyModel = ponyModel;
		
		this._init();
	}
	PonyAnimationSetting.prototype = Object.create(View.prototype);
	PonyAnimationSetting.prototype.constructor = PonyAnimationSetting;

	PonyAnimationSetting.prototype._init = function() {
		
		var settingsLayout = new SequentialLayout({
			direction: Util.Direction.Y
		});
		
		var speedX = this._makeSpeedSlider("X");
		var speedY = this._makeSpeedSlider("Y");
		
		var pony = new ImageSurface({
			size: [true, 50],
			content: this.options.ponies + this._pony.spriteFile
		});
		
		settingsLayout.sequenceFrom([pony, speedX, speedY]);
		this.add(settingsLayout);
		
		globalEvents.on("speedChange", _.bind(this._onSpeedChange, this));
	}
	
	PonyAnimationSetting.prototype._onSpeedChange = function(e) {
		if(e.direction === 'X') {
			this._ponyModel.setSpeedX(e.pony, e.value);
		} else {
			this._ponyModel.setSpeedY(e.pony, e.value);
		}
	}
	
	PonyAnimationSetting.prototype._makeSpeedSlider = function(direction) {
		
		var layout = new SequentialLayout({
			direction: Util.Direction.Y
		});
		
		var view = new View();
		var left = new Surface({
			size: [true, true],
			content: "-100%"
		});
		var right = new Surface({
			size: [true, true],
			content: "+100%"
		});
		
		var rightMod = new Modifier();
		rightMod.setOrigin([1,0]);
		rightMod.setAlign([1,0]);
		
		view.add(left);
		view.add(rightMod).add(right);
		
		var speedVector = this._ponyModel.getSpeed(this._pony.id);
		var initialSpeed;
		if(direction === 'X') {
			initialSpeed = speedVector[0];
		} else {
			initialSpeed = speedVector[1];
		}
		
		var slider = new InputSurface({
			size: [undefined, 50],
			type: 'range',
			attributes: {
				min: "-100",
				max: "100",
				value: "100",
				onchange: "globalEvents.emit('speedChange', {pony: '" + this._pony.id + "', value: this.value, direction: '" + direction + "'});"
			}
		});
		
		layout.sequenceFrom([view, slider]);
		return layout;
	};
	
	return PonyAnimationSetting;
});