// Base configuration
var baseConfig = {
	"unitName": "Microchips",
	"unitIcon": "<i class='fas fa-microchip'></i>",
	"buildsToUnlockNext":5,
	"costIncrement": 1.4
}

// Save to use when starting new game
var baseSave = {
	"totalClicks": 0,
	"units": 0,
	"unitsPerClick": 1,
	"unitsPerSecond": 0,
	"saveBuilds":[0]
}

// Save loaded. If no save -> save = baseSave
var save = {
	"totalClicks": 0,
	"units": 400000000,
	"unitsPerClick": 1,
	"unitsPerSecond": 0,
	"saveBuilds":[10, 8, 6]
}
var builds = [
	{
		"name": "Pieza",
		"baseCost": 10,
		"unitsPerSecond": 0.1
	},{
		"name": "Pieza2",
		"baseCost": 15,
		"unitsPerSecond": 0.3
	},{
		"name": "Pieza3",
		"baseCost": 16,
		"unitsPerSecond": 0.5
	},{
		"name": "Pieza4",
		"baseCost": 19,
		"unitsPerSecond": 0.75
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

setInterval(function(){

	console.log("------UNITS PER SECOND: " + save.unitsPerSecond);
	console.log("------UNITS PER CLICK: " + save.unitsPerClick);
	save.units = Math.round((save.units + save.unitsPerSecond)*100)/100;
	updateBuy();
	updateInfo();

}, 1000)


function buildClick() {
		save.units -= $(this).data("priceNow");
		if($(this).data("unitsPerClick") != undefined) {
			save.unitsPerClick += $(this).data("unitsPerClick");
		} else {
			save.unitsPerSecond += $(this).data("unitsPerSecond");
		}
		
		$(this).data("qtty", $(this).data("qtty") + 1);
		$(this).data("priceNow", Math.round($(this).data("priceNow") * baseConfig.costIncrement));
		$(this).children("span.qtty").html($(this).data("qtty"));
		$(this).children("span.qtty").removeClass("badge-danger").addClass("badge-success");


		if($(this).data("qtty") == baseConfig.buildsToUnlockNext && $(this).data("id") < builds.length - 1) {
			console.log(builds[$(this).data("id") + 1]);
			var buildElement = $("<button class='btn list-group-item'> " + builds[$(this).data("id") + 1].name + " </button>");
			var priceNow = builds[$(this).data("id") + 1].baseCost;
			buildElement.append("<span class='badge badge-danger float-right qtty'>0</span>");
			buildElement.prepend("<span class='badge badge-warning float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");
			buildElement.data({
				"id": $(this).data("id") + 1,
				"qtty": 0,
				"baseCost": builds[$(this).data("id") + 1].baseCost,
				"priceNow": priceNow,
				"unitsPerClick": builds[$(this).data("id") + 1].unitsPerClick,
				"unitsPerSecond": builds[$(this).data("id") + 1].unitsPerSecond
			});
			$("#buy ul").append(buildElement);
		}
		updateBuy();
		updateInfo();
};

function updateBuy() {
	$("#buy ul button").each(function() {
		if(($(this).data("qtty") > 0 && $(this).data("priceNow") <= save.units) || ($(this).data("qtty") == 0 && builds[$(this).data("id")].baseCost <= save.units)) {
			$(this).removeClass("disabled");
			$(this).addClass("list-group-item-success");
			$(this).off("click");
			$(this).on("click", buildClick);
		} else {
			$(this).off("click");
			$(this).removeClass("list-group-item-success");
			$(this).addClass("disabled");
		}
		$(this).children("span.badge-warning").html($(this).data("priceNow") + " " + baseConfig.unitIcon);
	});
}

function loadInfo() {
	$("#unitsName").html("<span class='badge badge-warning'>" + baseConfig.unitName + " " + baseConfig.unitIcon + "</span>");
}

// Updates header to show changes
function updateInfo() {
	$("#unitsAmount").html("<span class='badge badge-light'>" + save.units + "</span>");
	$("#clicksAmount").html("<span class='badge badge-light'>" + save.totalClicks + "</span>");
}

/*
 * 
 */
function loadBuy() {
	var buyList = $("<ul></ul>");
	buyList.addClass("list-group");
	var qtty;
	var buildElement;
	var priceNow;
	var addNext = false;

	// Add first element no matter what
	buildElement = $("<button class='btn list-group-item'> " + builds[0].name + " </button>");
	if(save.saveBuilds[0] > 0) {
		priceNow = builds[0].baseCost * save.saveBuilds[0] * baseConfig.costIncrement;
		buildElement.append("<span class='badge badge-success float-right qtty'>" + save.saveBuilds[0] + "</span>");
	} else {
		priceNow = builds[0].baseCost;
		save.saveBuilds[0] = 0;
		buildElement.append("<span class='badge badge-danger float-right qtty'>" + save.saveBuilds[0] + "</span>");
		
	}
	if(priceNow <= save.units) {
		buildElement.addClass("list-group-item-success");
	} else {
		buildElement.addClass("disabled");
	}
	buildElement.prepend("<span class='badge badge-warning float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");
	buildElement.data({
		"id": 0,
		"qtty": save.saveBuilds[0],
		"baseCost": builds[0].baseCost,
		"priceNow": priceNow,
		"unitsPerClick": builds[0].unitsPerClick,
		"unitsPerSecond": builds[0].unitsPerSecond
	});
	buildElement.on("click", buildClick);
	buyList.append(buildElement);


	for(var i = 1; i < save.saveBuilds.length; i++) {
		qtty = save.saveBuilds[i];
		buildElement = $("<button class='btn list-group-item'> " + builds[i].name + " </button>");
		if(qtty > 0) {
			buildElement.append("<span class='badge badge-success float-right qtty'>" + qtty + "</span>");
			priceNow = Math.round(qtty * builds[i].baseCost * baseConfig.costIncrement);
		} else {
			buildElement.append("<span class='badge badge-danger float-right qtty'>" + qtty + "</span>");
			priceNow = builds[i].baseCost;
		}		

		buildElement.prepend("<span class='badge badge-warning float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");

		buildElement.data({
			"id": i,
			"qtty": qtty,
			"baseCost": builds[i].baseCost,
			"priceNow": priceNow,
			"unitsPerClick": builds[i].unitsPerClick,
			"unitsPerSecond": builds[i].unitsPerSecond
		});

		if((qtty > 0 && priceNow <= save.units) || (qtty == 0 && builds[i].baseCost <= save.units)) {
			buildElement.removeClass("disabled");
			buildElement.addClass("list-group-item-success");
			buildElement.on("click", buildClick);
		} else {
			buildElement.addClass("disabled");
		}
		
		buyList.append(buildElement);
		if(qtty >= baseConfig.buildsToUnlockNext && builds[i] != undefined) {
			addNext = true;
		}

	}

	// Add next in list if its unlocked by buildsToUnlockNext
	if(addNext) {
		if(builds[save.saveBuilds.length].baseCost <= save.units) {
			buildElement = $("<button class='btn list-group-item list-group-item-success'> " + builds[save.saveBuilds.length].name + " </button>");
		} else {
			buildElement = $("<button class='btn list-group-item disabled'> " + builds[save.saveBuilds.length].name + " </button>");
		}
		
		priceNow = builds[save.saveBuilds.length].baseCost;
		buildElement.append("<span class='badge badge-danger float-right qtty'>0</span>");
		buildElement.prepend("<span class='badge badge-warning float-left'>" + priceNow + " " + baseConfig.unitIcon + "</span>");
		buildElement.data({
			"id": save.saveBuilds.length,
			"qtty": 0,
			"baseCost": builds[save.saveBuilds.length].baseCost,
			"priceNow": priceNow,
			"unitsPerClick": builds[save.saveBuilds.length].unitsPerClick,
			"unitsPerSecond": builds[save.saveBuilds.length].unitsPerSecond
		});
		buildElement.on("click", buildClick);
		buyList.append(buildElement);
	}


	$("#buy").append(buyList);
}

// What to do when you click clickArea. Usually increment amount of units and total clicks
$("#clickArea").on("click", function(e){
	save.totalClicks++;
	save.units += save.unitsPerClick;

	var badge = $("<span class='badge badge-warning'>+" + save.unitsPerClick + " " + baseConfig.unitIcon + "</span>");
	badge.css({'top':e.pageY-100,'left':e.pageX, 'position':'absolute'});
	$("#clickArea").append(badge);
	badge.fadeIn(1000).fadeOut(500, function() { $(this).remove(); });
	updateBuy();
	updateInfo();
});



loadInfo();
loadBuy();