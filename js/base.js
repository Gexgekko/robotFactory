// Base configuration
var baseConfig = {
	"unitName": "Microchips",
	"unitIcon": "<i class='fas fa-microchip'></i>",
	"buildingsToUnlockNext":5,
	"costIncrement": 1.40
}

// Save to use when starting new game
var baseSave = {
	"totalClicks": 0,
	"units": 0,
	"unitsPerClick": 1,
	"unitsEachSecond": 0,
	"unitsPerBuilding": [0],
	"savedBuildings":[0],
	"savedTheme": 0
}

// Save loaded. If no save -> save = baseSave
var save = {
	"totalClicks": 0,
	"units": 10,
	"unitsPerClick": 1,
	"unitsEachSecond": 6.40,
	"unitsPerBuilding": [1, 2.40, 3],
	"savedBuildings":[10, 8, 6],
	"savedTheme": 1
}


var buildings = [
	{
		"name": "Pieza",
		"baseCost": 10,
		"unitsPerSecond": 0.10
	},{
		"name": "Pieza2",
		"baseCost": 15,
		"unitsPerSecond": 0.30
	},{
		"name": "Pieza3",
		"baseCost": 16,
		"unitsPerSecond": 0.50
	},{
		"name": "Pieza4",
		"baseCost": 19,
		"unitsPerSecond": 0.750
	},{
		"name": "Pieza5",
		"baseCost": 20,
		"unitsPerSecond": 1
	},{
		"name": "Pieza6",
		"baseCost": "90000",
		"unitsPerClick": 2
	}
];

var themes = [
	{
		"themeName": "Light Theme",
		"backgroundColor": "bg-light",
		"clickColor": "warning",
		"buildingAffordable": "success",
		"hasNoBuilding": "danger",
		"hasBuilding": "success",
		"buildingPrice": "warning",
		"unitsColor": "warning",
		"amountDisplay": "light"
	},{
		"themeName": "Dark Theme",
		"backgroundColor": "bg-dark",
		"clickColor": "warning",
		"buildingAffordable": "success",
		"hasNoBuilding": "danger",
		"hasBuilding": "success",
		"buildingPrice": "warning",
		"unitsColor": "warning",
		"amountDisplay": "light"
	}
]



var theme = themes[save.savedTheme];
console.log(theme);
setInterval(function(){

	//console.log("------UNITS PER SECOND: " + save.unitsEachSecond);
	//console.log("------UNITS PER CLICK: " + save.unitsPerClick);
	save.units = Math.round((save.units + save.unitsEachSecond)*100)/100;
	updateBuy();
	updateInfo();

}, 1000)


function buildingClick() {
		save.units -= $(this).data("priceNow");
		if($(this).data("unitsPerClick") != undefined) {
			save.unitsPerClick += $(this).data("unitsPerClick");
		} else {
			save.unitsEachSecond = Math.round((save.unitsEachSecond + $(this).data("unitsPerSecond"))*100)/100;
			Math.round((save.units + save.unitsEachSecond)*100)/100
			save.unitsPerBuilding[$(this).data("id")] = Math.round((save.unitsPerBuilding[$(this).data("id")] + $(this).data("unitsPerSecond"))*100)/100;
			//console.error("Units per build --------");
			//console.log(save.unitsPerBuilding);
			//console.error("------------")
		}

		$(this).data("qtty", $(this).data("qtty") + 1);
		$(this).data("priceNow", Math.round($(this).data("priceNow") * baseConfig.costIncrement));
		$(this).children("span.qtty").html($(this).data("qtty"));
		$(this).children("span.qtty").removeClass("badge-" + theme.hasNoBuilding).addClass("badge-" + theme.hasBuilding);


		if($(this).data("qtty") == baseConfig.buildingsToUnlockNext && $(this).data("id") < buildings.length - 1) {
			var buildingElement = $("<button class='btn list-group-item'> " + buildings[$(this).data("id") + 1].name + " </button>");
			var priceNow = buildings[$(this).data("id") + 1].baseCost;
			buildingElement.append("<span class='badge badge-" + theme.hasNoBuilding + " float-right qtty'>0</span>");
			buildingElement.prepend("<span class='badge badge-" + theme.buildingPrice + " float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");
			buildingElement.data({
				"id": $(this).data("id") + 1,
				"qtty": 0,
				"baseCost": buildings[$(this).data("id") + 1].baseCost,
				"priceNow": priceNow,
				"unitsPerClick": buildings[$(this).data("id") + 1].unitsPerClick,
				"unitsPerSecond": buildings[$(this).data("id") + 1].unitsPerSecond
			});
			$("#buy ul").append(buildingElement);
		}
		updateBuy();
		updateInfo();
};

function updateBuy() {
	$("#buy ul button").each(function() {
		if(($(this).data("qtty") > 0 && $(this).data("priceNow") <= save.units) || ($(this).data("qtty") == 0 && buildings[$(this).data("id")].baseCost <= save.units)) {
			$(this).removeClass("disabled");
			$(this).addClass("list-group-item-" + theme.buildingAffordable);
			$(this).off("click");
			$(this).on("click", buildingClick);
		} else {
			$(this).off("click");
			$(this).removeClass("list-group-item-" + theme.buildingAffordable);
			$(this).addClass("disabled");
		}
		$(this).children("span.badge-" + theme.buildingPrice).html($(this).data("priceNow") + " " + baseConfig.unitIcon);
	});
}

function loadInfo() {
	$("#unitsName").html("<span class='badge badge-" + theme.unitsColor + "'>" + baseConfig.unitName + " " + baseConfig.unitIcon + "</span>");
}

// Updates header to show changes
function updateInfo() {
	$("#unitsAmount").html("<span class='badge badge-" + theme.amountDisplay + "'>" + save.units + "</span>");
	$("#clicksAmount").html("<span class='badge badge-" + theme.amountDisplay + "'>" + save.totalClicks + "</span>");
}

/*
 *
 */
function loadBuy() {
	var buyList = $("<ul></ul>");
	buyList.addClass("list-group");
	var qtty;
	var buildingElement;
	var priceNow;
	var addNext = false;

	// Add first element no matter what
	buildingElement = $("<button class='btn list-group-item'> " + buildings[0].name + " </button>");
	if(save.savedBuildings[0] > 0) {
		priceNow = buildings[0].baseCost * save.savedBuildings[0] * baseConfig.costIncrement;
		buildingElement.append("<span class='badge badge-" + theme.hasBuilding + " float-right qtty'>" + save.savedBuildings[0] + "</span>");
	} else {
		priceNow = buildings[0].baseCost;
		save.savedBuildings[0] = 0;
		buildingElement.append("<span class='badge badge-" + theme.hasNoBuilding + " float-right qtty'>" + save.savedBuildings[0] + "</span>");

	}
	if(priceNow <= save.units) {
		buildingElement.addClass("list-group-item-" + theme.buildingAffordable);
	} else {
		buildingElement.addClass("disabled");
	}
	buildingElement.prepend("<span class='badge badge-" + theme.buildingPrice + " float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");
	buildingElement.data({
		"id": 0,
		"qtty": save.savedBuildings[0],
		"baseCost": buildings[0].baseCost,
		"priceNow": priceNow,
		"unitsPerClick": buildings[0].unitsPerClick,
		"unitsPerSecond": buildings[0].unitsPerSecond
	});
	buildingElement.on("click", buildingClick);
	buyList.append(buildingElement);


	for(var i = 1; i < save.savedBuildings.length; i++) {
		qtty = save.savedBuildings[i];
		buildingElement = $("<button class='btn list-group-item'> " + buildings[i].name + " </button>");
		if(qtty > 0) {
			buildingElement.append("<span class='badge badge-" + theme.hasBuilding + " float-right qtty'>" + qtty + "</span>");
			priceNow = Math.round(qtty * buildings[i].baseCost * baseConfig.costIncrement);
		} else {
			buildingElement.append("<span class='badge badge-" + theme.hasNoBuilding + " float-right qtty'>" + qtty + "</span>");
			priceNow = buildings[i].baseCost;
		}

		buildingElement.prepend("<span class='badge badge-" + theme.buildingPrice + " float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");

		buildingElement.data({
			"id": i,
			"qtty": qtty,
			"baseCost": buildings[i].baseCost,
			"priceNow": priceNow,
			"unitsPerClick": buildings[i].unitsPerClick,
			"unitsPerSecond": buildings[i].unitsPerSecond
		});

		if((qtty > 0 && priceNow <= save.units) || (qtty == 0 && buildings[i].baseCost <= save.units)) {
			buildingElement.removeClass("disabled");
			buildingElement.addClass("list-group-item-" + theme.buildingAffordable);
			buildingElement.on("click", buildingClick);
		} else {
			buildingElement.addClass("disabled");
		}

		buyList.append(buildingElement);
		if(qtty >= baseConfig.buildingsToUnlockNext && buildings[i] != undefined) {
			addNext = true;
		}

	}

	// Add next in list if its unlocked by buildingsToUnlockNext
	if(addNext) {
		if(buildings[save.savedBuildings.length].baseCost <= save.units) {
			buildingElement = $("<button class='btn list-group-item list-group-item-" + theme.buildingAffordable + "'> " + buildings[save.savedBuildings.length].name + " </button>");
		} else {
			buildingElement = $("<button class='btn list-group-item disabled'> " + buildings[save.savedBuildings.length].name + " </button>");
		}

		priceNow = buildings[save.savedBuildings.length].baseCost;
		buildingElement.append("<span class='badge badge-" + theme.hasNoBuilding + " float-right qtty'>0</span>");
		buildingElement.prepend("<span class='badge badge-" + theme.buildingPrice + " float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");
		buildingElement.data({
			"id": save.savedBuildings.length,
			"qtty": 0,
			"baseCost": buildings[save.savedBuildings.length].baseCost,
			"priceNow": priceNow,
			"unitsPerClick": buildings[save.savedBuildings.length].unitsPerClick,
			"unitsPerSecond": buildings[save.savedBuildings.length].unitsPerSecond
		});
		buildingElement.on("click", buildingClick);
		buyList.append(buildingElement);
	}

	$("#buy").html("");
	$("#buy").append(buyList);
}

// What to do when you click clickArea. Usually increment amount of units and total clicks
$("#clickArea").on("click", function(e){
	save.totalClicks++;
	save.units += save.unitsPerClick;

	var badge = $("<span class='badge badge-" + theme.clickColor + "'>+" + save.unitsPerClick + " " + baseConfig.unitIcon + "</span>");
	badge.css({'top':e.pageY-100,'left':e.pageX, 'position':'absolute'});
	$("#clickArea").append(badge);
	badge.fadeIn(1000).fadeOut(500, function() { $(this).remove(); });
	updateBuy();
	updateInfo();
});

$("body").addClass(theme.backgroundColor);

function updateAll() {
	$("body").addClass(theme.backgroundColor);
	loadInfo();
	loadBuy();
	loadInfo();
}

function themeSelect(event){
	if(event.data.id != save.savedTheme) {
		$("body").removeClass(theme.backgroundColor);
		theme = themes[event.data.id];
		save.savedTheme = event.data.id;
		updateAll();
	}
	$("#themeSelector").children().removeClass("active");
	$(this).addClass("active");
}

function loadConfig() {
	for(var i = 0; i < themes.length; i++){
		if(i == save.savedTheme) {
			$("#themeSelector").append("<a class='dropdown-item active'>" + themes[i].themeName + "</a>");
		} else {
			$("#themeSelector").append("<a class='dropdown-item'>" + themes[i].themeName + "</a>");
		}
		$("#themeSelector :last-child").on("click", {"id": i }, themeSelect);
	}
}



loadInfo();
loadBuy();
loadConfig();
