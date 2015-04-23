define(function () {
	
	var Timer = famous.utilities.Timer;
	var Random = famous.math.Random;
	
	function PonyAnimator(options, context, selectionModel) {
		this._options = options;
		this._selectionModel = selectionModel;
		this._context = context;
		this._ponyModifiers = {};
		this._burnModifiers = {};
		this._areWeBurning = false;
		
		this._init();
	}
	
	PonyAnimator.ALIGN_SPEED_FACTOR = 0.00001;
	
	PonyAnimator.prototype._init = function() {
		this._selectionModel.on('selectionChanged', _.bind(function(e) {
			this._setPonySelection(e);
		}, this));
		
		this._selectionModel.on('toggleBurn', _.bind(function(e) {
			this._areWeBurning = !this._areWeBurning;
			this._refreshBurn();
		}, this));
		
		this._selectionModel.on('speedChange', _.bind(function(e){
			this._changeSpeed(e);
		}, this));
	}
	
	PonyAnimator.prototype._changeSpeed = function(e) {
		console.log(e);
	}
	
	PonyAnimator.prototype._setPonySelection = function(e) {
		if(e.newState) {
			this._addPony(e.pony);
		} else { //unselected
			this._hidePony(e.pony);
		}
	}
	
	PonyAnimator.prototype._hidePony = function(pony) {
		
		var modifier = this._ponyModifiers[pony.id];
		if(!modifier) {
			return;
		}
		
		//invariant: pony has modifier
		modifier.setOpacity(0);
	}
	
	PonyAnimator.prototype._addPony = function(pony) {
		
		var modifier = this._ponyModifiers[pony.id];
		if(modifier) {
			modifier.setOpacity(1);
			return;
		}
		
		//invariant: first add of this pony
		
		var ponySurface = new ImageSurface({
			size: [true, true],
			content: this._options.ponies + pony.spriteFile
		});
		
		var align = this._randomStartPosition();
		var ponyModifier = new Modifier({
			origin: [0.5, 0.5], //centre of pony
			align: align,
		});
		
		Timer.every(_.bind(function(modifier, align, ponyId) {
			var speed = this._selectionModel.getSpeed(ponyId)
			align[0] += speed[0] * PonyAnimator.ALIGN_SPEED_FACTOR;
			align[1] += speed[1] * PonyAnimator.ALIGN_SPEED_FACTOR;
			if(align[0] < 0) {
				align[0] = 1;
			} else if (align[0] > 1) {
				align[0] = 0;
			} 
			
			if(align[1] < 0) {
				align[1] = 1;
			} else if(align[1] > 1) {
				align[1] = 0;
			}
			
			modifier.setAlign(align);
		}, this, ponyModifier, align, pony.id), 1);
		
		//save pony modifier for later
		this._ponyModifiers[pony.id] = ponyModifier;
		
		var burnModifier = new Modifier();
		this._setBurnStateToModifier(burnModifier);
		
		this._burnModifiers[pony.id] = burnModifier;
		
		var ponyRootMod = this._context.add(ponyModifier)
        ponyRootMod.add(ponySurface);
		var burn = this._makeBurnSprite();
		ponyRootMod.add(burnModifier).add(this._makeBurnSprite());
	}
	
	PonyAnimator.prototype._refreshBurn = function() {
		_.each(this._burnModifiers, _.bind(this._setBurnStateToModifier, this));
	}
	
	PonyAnimator.prototype._setBurnStateToModifier = function(modifier) {
		var opacity = this._areWeBurning ? 1 : 0;
		modifier.setOpacity(opacity, {duration: 500});
	}
	
	PonyAnimator.prototype._makeBurnSprite = function() {
		return new ImageSurface({
			size: [true, true],
			content: this._options.imageRoot + "flame.gif"
		});
	}
	
	PonyAnimator.prototype._randomStartPosition = function() {
		return [Math.random(), Math.random()];
	}
	
	return PonyAnimator;
});