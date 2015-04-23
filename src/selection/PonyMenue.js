
define(function(require) {
	
	var Surface = famous.core.Surface;
	var FlexibleLayout = famous.views.FlexibleLayout;
	var GridLayout = famous.views.GridLayout;
	var Flipper = famous.views.Flipper;
	var View = famous.core.View;
	var Timer = famous.utilities.Timer;
	
	var PonyAnimationSetting = require('selection/PonyAnimationSetting');
	
	function PonyMenue(options, ponyData, selectionModel) {
	    View.apply(this, arguments);
	    this._options = options;
	    this._selectionModel = selectionModel;
	    this._ponyData = ponyData;
	    this._modifier = new Modifier();
	    this._flippers = {};
	    this._init();
	}
	PonyMenue.prototype = Object.create(View.prototype);
	PonyMenue.prototype.constructor = PonyMenue;
	
	PonyMenue.prototype._makePonySurfaces = function(gridCount) {
		var i=0;
		var ponies = [];
		for(i=0;i<gridCount;i++) {
			var pony = this._ponyData.ponies[i];
			
			var frontSurface; 
			if(i >= this._ponyData.ponies.length) {
				frontSurface = new Surface({
					properties: {
						backgroundColor: 'gray'
					}
				});
			} else {
				frontSurface = new Surface({
					content: '<div><center><img style="margin-top: 15px" src="' + this._options.ponies + pony.spriteFile + '"</img></center></div>',
					properties: {
						backgroundColor: '#fc968d'
					}
				});
			}

			var flipper = new Flipper();
			flipper.setFront(frontSurface);
			
			if(pony) {
				var backSurface = new PonyAnimationSetting(this._options, pony, this._selectionModel);
				flipper.setBack(backSurface);
			}
		
			var that = this;
			if(pony) {
				this._flippers[pony.id] = {flipper: flipper, toggle: false};
				
				frontSurface.on('click', _.partial(function(e, pony) {
					var newSelection = that._selectionModel.toggleSelection(pony.id);
					if(newSelection) {
						e.setOptions({properties: {backgroundColor: '#43E085'}});
					} else {
						e.setOptions({properties: {backgroundColor: '#fc968d'}});
					}
					
				}, frontSurface, pony));
			}
			ponies.push(flipper);
		}
		return ponies;
	}

	
	PonyMenue.prototype.showTelemetrie = function() {
		var i = 1;
		_.each(this._ponyData.ponies, _.bind(function(pony) {
			this._deferred(i*50, _.bind(function() {
				this._flip(pony.id);
			}, this));
			i++;
		}, this));
	};

	PonyMenue.prototype._deferred = function(t, f) {
		 Timer.setTimeout(function() {
		        f.call(this);
		    }, t);
	}
	
	PonyMenue.prototype._flip = function(id) {
		var flipper = this._flippers[id];
		if(!flipper) {
			return;
		}
		
		var angle = flipper.toggle ? 0 : Math.PI;
	    flipper.flipper.setAngle(angle, {curve : 'easeOutBounce', duration : 500});
	    flipper.toggle = !flipper.toggle;
	}
	
	PonyMenue.prototype._init = function(){
		this._modifier.setAlign([-1,-1]);
		var gridSize = Math.ceil(Math.sqrt( this._ponyData.ponies.length ));
		
		var ponySelectionLayout = new FlexibleLayout({
			direction: Util.Direction.X,
		    ratios: [50, 50]
		});
		var dim = Math.max(gridSize, 4);
		var ponySelectionGrid = new GridLayout({
			dimensions: [dim,dim],
			gutterSize: [5,5]
		});
		
		var dummySurface = new Surface({
		    properties: {
		    	backgroundColor: 'transparent'
		    }
		});
		
		var ponies = this._makePonySurfaces(dim*dim);
		ponySelectionGrid.sequenceFrom(ponies);
		
		var ponyGridWithMenue = new FlexibleLayout({
			direction: Util.Direction.Y,
			ratios: [96, 4]
		});
	
		var gridMenue = new GridLayout({
			dimensions: [2, 1]
		});
		
		var gridClose = new Surface({
			content: "Close",
			properties: {
				backgroundColor: "yellow"
			}
		});
		var that = this;
		gridClose.on('click', function() {
			that._modifier.setAlign([-1,-1], {duration: 500, curve: 'linear'});
		});
		
		var telemetrie = new Surface({
			content: "Pony Telemetrie",
			properties: {
				backgroundColor: "pink"
			}
		});
		telemetrie.on('click', function() {
			that.showTelemetrie();
		});
		
		gridMenue.sequenceFrom([gridClose, telemetrie]);
		ponyGridWithMenue.sequenceFrom([ponySelectionGrid, gridMenue]);
		ponySelectionLayout.sequenceFrom([ponyGridWithMenue, dummySurface]);
		this.add(ponySelectionLayout);
	}
	
	PonyMenue.prototype.addTo = function(root) {
		root.add(this._modifier).add(this);
	}
	
	PonyMenue.prototype.show = function() {
		this._modifier.setAlign([0,0], {duration: 500, curve: 'linear'});
	}
	
	return PonyMenue;
});
