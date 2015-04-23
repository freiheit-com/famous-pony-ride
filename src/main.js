/*global famous*/
// import dependencies
//TODO cleanup depdencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var ImageSurface = famous.surfaces.ImageSurface;
var Util = famous.utilities.Utility;
var FlexibleLayout = famous.views.FlexibleLayout;
var GridLayout = famous.views.GridLayout;
var Flipper = famous.views.Flipper;
var View = famous.core.View;
var EventEmitter = famous.core.EventEmitter;

var globalEvents = new EventEmitter();

require(["selection/PonyMenue", "selection/PonyModel", "animation/PonyAnimator", "menue/MainMenue", "data/PonyDef"], function (PonyMenue, PonyModel, PonyAnimator, MainMenue, ponyData) {
	
	var globalOptions = {
			imageRoot: 'images/',
			ponies: 'images/ponies/'
	};
	
    var mainContext = Engine.createContext();
	var selectionModel = new PonyModel(ponyData);
	var animator = new PonyAnimator(globalOptions, mainContext, selectionModel);
	var ponyMenue = new PonyMenue(globalOptions, ponyData, selectionModel);
	var mainMenue = new MainMenue(globalOptions, ponyData, ponyMenue, selectionModel);
	
	var background = new ImageSurface({
		content: 'images/backgrounds/quarry.png'
	});

	var layout = new FlexibleLayout({
		direction: Util.Direction.Y,
		ratios: [2, 98]
    });
    layout.sequenceFrom([mainMenue, background]);
		
    var mainView = new View();
	mainView.add(layout);

	var selMod = new Modifier({
			transform: function() {
				return Transform.translate(0, 0, 500);
			}
	});
	
	mainContext.add(mainView);
	ponyMenue.addTo(mainContext.add(selMod));
});