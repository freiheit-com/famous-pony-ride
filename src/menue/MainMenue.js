define(function(require) {
	
	var View = famous.core.View;
	var Surface = famous.core.Surface;
	var SequentialLayout = famous.views.SequentialLayout;

	function MainMenue(options, ponyData, ponyMenue, ponyModel) {
		View.apply(this, arguments);
		this._options = options;
		this._ponyMenue = ponyMenue;
		this._ponyModel = ponyModel;
		this._ponyData = ponyData;
		
		this._init();
	}
	MainMenue.prototype = Object.create(View.prototype);
	MainMenue.prototype.constructor = MainMenue;
	
	MainMenue.prototype._init = function() {
		var ponyMenueButton = this._makePonyMenueButton();

		var spacer = new Surface({
			size: [50, undefined]
		});
		
		var burnMenue = this._makeBurnMenueButton();
		
		var menue = new SequentialLayout({
			direction: Util.Direction.X
		});
		
		menue.sequenceFrom([ponyMenueButton, spacer, burnMenue]);
		this.add(menue);
	};
	
	MainMenue.prototype._addToggleBurnListener = function(thing) {
		thing.on('click', _.bind(function() {
			this._ponyModel.toggleBurn();
		}, this));
	}
	
	MainMenue.prototype._addOpenPonyMenueListener = function(thing) {
		thing.on('click', _.bind(function() {
			this._ponyMenue.show();
		}, this));
	}

	MainMenue.prototype._makePonyMenueButton = function() {
		var button = new SequentialLayout({
			direction: Util.Direction.X
		});
		
		var teaserPonies = _.first(this._ponyData.ponies, 4);
		var teaserPoniesImgs = _.map(teaserPonies, _.bind(function(pony) {
			var img = new ImageSurface({
				size: [20, undefined],
				content: this.options.ponies + pony.spriteFile,
				properties: {
					backgroundColor: 'pink'
				}
			});
			this._addOpenPonyMenueListener(img);
			return img;
		}, this));
		
		button.sequenceFrom(teaserPoniesImgs);
		return this._wrapInAView(button);
	}
	
	MainMenue.prototype._makeBurnMenueButton = function() {
		var button = new SequentialLayout({
			direction: Util.Direction.X
		});
		
		var burnImgs = _.map(_.range(4), _.bind(function() {
			var img = new ImageSurface({
				size: [20, undefined],
				content: this.options.imageRoot + 'flame.gif'
			});
			this._addToggleBurnListener(img);
			return img;
		}, this));
		
		button.sequenceFrom(burnImgs);
		return this._wrapInAView(button);
	}

	MainMenue.prototype._wrapInAView = function(thing){
		var view = new View();
		view.add(thing);
		return view;
	}
	
	return MainMenue;
});