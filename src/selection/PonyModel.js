define(function () {
	
	var EventEmitter = famous.core.EventEmitter;
	var Random = famous.math.Random;
	
	function PonyModel(ponyData) {
		this._ponyData = ponyData;
		this._states = {};
		this._speeds = {};
		
		this._eventChannel = new EventEmitter();
	
		this._initWithRandomSpeed();
	}

	PonyModel.prototype._initWithRandomSpeed = function() {
		_.each(this._ponyData.ponies, _.bind(function(pony) {
			this._speeds[pony.id] = [this._randomSpeed(), this._randomSpeed()];
		}, this));
	}	
	
	PonyModel.prototype._randomSpeed = function() {
		return Math.random() * 100;
	}
	
	PonyModel.prototype._findPonyWith = function(id) {
		return _.find(this._ponyData.ponies,function(pony) {
			return pony.id === id;
		});
	}
	
	PonyModel.prototype.setSelected = function(id, state) {
		var oldState = this._states[id];
		var normalisedState = state ? true : false;
		this._states[id] = normalisedState;
		
		var pony = this._findPonyWith(id);
		
		if(oldState !== normalisedState) {
			this._eventChannel.emit('selectionChanged', {newState: normalisedState, pony: pony});
		}
	}
	
	PonyModel.prototype.toggleBurn = function() {
		this._eventChannel.emit('toggleBurn');
	}
	
	PonyModel.prototype.isSelected = function(id) {
		return this._states[id];
	}
	
	PonyModel.prototype.toggleSelection = function(id) {
		var newSelection = !this.isSelected(id);
		this.setSelected( id, newSelection );
		return newSelection;
	}
	
	PonyModel.prototype.setSpeedX = function(id, value) {
		var speed = this._speeds[id];
		speed[0] = value;
	}
	
	PonyModel.prototype.setSpeedY = function(id, value) {
		var speed = this._speeds[id];
		speed[1] = value;
	}
	
	PonyModel.prototype.getSpeed = function(id) {
		return this._speeds[id];
	}
	
	PonyModel.prototype.on = function(type, handler) {
		this._eventChannel.on(type, handler);
	}
	
	return PonyModel;
});