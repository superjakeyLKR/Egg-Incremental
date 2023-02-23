var score = OmegaNum(0);
var chickens = OmegaNum(1);
var coopsize = OmegaNum(10);
var coopprice = OmegaNum(100);
var eggmultiplier = OmegaNum(1);

var chickens_interval = setInterval(Increment, 1000);

var hatchmode = false;
var hatchchance = OmegaNum(10); //percent
var hatchamount = OmegaNum(1);
var purchasedupgrades = [];
const UPGRADES = {
    "e1": {
      cost: 30,
      effect: function() {
        hatchchance = hatchchance.plus(5);
      },
      currency: "eggs"
    },
    "e2": {
      cost: 90,
      effect: function() {
        hatchchance = hatchchance.plus(10);
      },
      currency: "eggs"
    },
    "e3": {
      cost: 150,
      effect: function() {
        hatchchance = hatchchance.plus(15);
      },
      currency: "eggs"
    },
    "e4": {
      cost: 500,
      effect: function() {
        hatchamount = hatchamount.plus(2);
      },
      currency: "eggs"
    },
    "e5": {
      cost: 1000,
      effect: function() {
        Unlock("money");
      },
      currency: "eggs"
    },
    "e6": {
      cost: 2000,
      effect: function() {
        hatchamount = hatchamount.plus(9);
      },
      currency: "eggs"
    },
    "e7": {
      cost: 5000,
      effect: function() {}, //Effect is handled in the Sell function
      currency: "eggs"
    },
    "e8": {
      cost: 10000,
      effect: function() {
        hatchamount = hatchamount.plus(20);
      },
      currency: "eggs"
    },
    "e9": {
      cost: 15000,
      effect: function() {
        hatchchance = hatchchance.plus(30);
      },
      currency: "eggs"
    },
    "e10": {
      cost: 20000,
      effect: function() {
        Unlock("time")
      },
      currency: "eggs"
    },
    "m1": {
      cost: 1,
      effect: function() {
        eggmultiplier = eggmultiplier.plus(1);
      },
      currency: "money"
    },
    "m2": {
      cost: 5,
      effect: function() {}, //Effect is handled in the Increment function
      currency: "money"
    },
    "m3": {
      cost: 10,
      effect: function() {
        hatchchance = hatchchance.plus(30);
      },
      currency: "money"
    },
    "m4": {
      cost: 50,
      effect: function() {
        if (purchasedupgrades.includes("m1")) {
          eggmultiplier = eggmultiplier.mul(3);
        } else {
          eggmultiplier = eggmultiplier.add(2);
        }
      },
      currency: "money"
    },
};
var money = OmegaNum(0);
var magnifiers = OmegaNum(0);
var minitrembles = OmegaNum(0);

var achieved = [];
Update();

function Update() {
  document.getElementById("score").innerText = score.toString();
  if (score.gte(1000)) {
    document.getElementById("sell").disabled = false;
    let sellfor = score.div(1000).floor();
    if (purchasedupgrades.includes("e7")) sellfor = sellfor.mul(2);
    document.getElementById("sell").innerText = "Sell Eggs (" + sellfor + " money)";
  } else {
    document.getElementById("sell").disabled = true;
    document.getElementById("sell").innerText = "Sell Eggs";
  }
  if (money.gte(1000)) {
    document.getElementById("timewarp").disabled = false;
    let timewarpfor = money.div(1000).floor();
    document.getElementById("timewarp").innerText = "Time Warp (" + timewarpfor + " magnifiers)";
  } else {
    document.getElementById("timewarp").disabled = true;
    document.getElementById("timewarp").innerText = "Time Warp";
  }
  let timeboost = 1000 / magnifiers.toNumber();
  if (timeboost === Infinity) timeboost = 1;
  document.getElementById("timeboost").innerText = magnifiers.toString() + " (every " + timeboost + "s)";
  document.getElementById("tremblerate").innerText = magnifiers.div(1000).toString();

	if (Math.floor(Math.random() * 100000) == 777) {
		document.title = "I SEE YOU";
	}
  //achievements
  if (chickens.gte(10)) Achieve(1); 
  if (coopsize.gt(100)) Achieve(2);
  if (purchasedupgrades.includes("e5")) Achieve(3); 
  if (money.gte(1)) Achieve(4);
  if (hatchchance.gte(100)) Achieve(5);
  if (chickens.gte(111)) Achieve(6);
  if (purchasedupgrades.includes("e10")) Achieve(7);
}

function Upgrade(id, rebuy=false) {
  let bought = false;
  if (!rebuy) {
    if (purchasedupgrades.includes(id)) return;
    switch (UPGRADES[id].currency) {
      case "eggs":
        if (score.gte(UPGRADES[id].cost)) {
          score = score.sub(UPGRADES[id].cost);
          bought = true;
        }
        break;
      case "money":
        if (money.gte(UPGRADES[id].cost)) {
          money = money.sub(UPGRADES[id].cost);
          bought = true;
        } 
        break;
    }
  } else {
    bought = true;
  }
  if (bought) {
    UPGRADES[id].effect();
    purchasedupgrades.push(id);
    document.getElementById("upgrade" + id).style = "background-color: green;";
  }
  document.getElementById("hatchchance").innerText = hatchchance.toString();
  document.getElementById("hatchamount").innerText = hatchamount.toString();
  document.getElementById("eggmultiplier").innerText = "x" + eggmultiplier.toString();
  document.getElementById("monies").innerText = money.toString();
}

function Save() {
  localStorage.setItem("score", score.toString());
  localStorage.setItem("chickens", chickens.toString());
  localStorage.setItem("coopsize", coopsize.toString());
  localStorage.setItem("coopprice", coopprice.toString());
  localStorage.setItem("hatchmode", hatchmode.toString());
  localStorage.setItem("money", money.toString());
  localStorage.setItem("egg_multiplier", eggmultiplier.toString());
  localStorage.setItem("purchased_upgrades", purchasedupgrades.toString());
  localStorage.setItem("achieved", achieved.toString());
  document.getElementById("save").innerText = "Saved!";
  setTimeout(function() {
    document.getElementById("save").innerText = "Save Game";
  }, 1000);
}

function Load() {
  score = OmegaNum(localStorage.getItem("score"));
  chickens = OmegaNum(localStorage.getItem("chickens"));
  coopsize = OmegaNum(localStorage.getItem("coopsize"));
  coopprice = OmegaNum(localStorage.getItem("coopprice"));
  hatchmode = localStorage.getItem("hatchmode") == "true";
  money = OmegaNum(localStorage.getItem("money"));
  eggmultiplier = OmegaNum(localStorage.getItem("egg_multiplier"));
  for (let i = 0; i < localStorage.getItem("achieved").split(",").length; i++) {
    Achieve(parseInt(achieved[i]));
  }
  document.getElementById("coopsize").innerText = coopsize.toString();
  document.getElementById("coopprice").innerText = coopprice.toString();
  if (hatchmode) document.getElementById("hatch").innerText = "Hatch Mode";
  else document.getElementById("hatch").innerText = "Egg Mode";
  document.getElementById("monies").innerText = money.toString();
  Update(); 
  //update upgrades (uses ups instead of purchasedupgrades to avoid infinite loop)
  let ups = localStorage.getItem("purchased_upgrades").split(",");
  for (var i = 0; i < ups.length; i++) {
    Upgrade(ups[i], true)
  }
  document.getElementById("load").innerText = "Loaded!";
  setTimeout(function() {
    document.getElementById("load").innerText = "Load Game";
  }, 1000);
}

function Reset() {
  score = OmegaNum(0);
  chickens = OmegaNum(1);
  coopsize = OmegaNum(10);
  coopprice = OmegaNum(100);
  eggmultiplier = OmegaNum(1);
  hatchmode = false;
  hatchchance = OmegaNum(10);
  hatchamount = OmegaNum(1);
  money = OmegaNum(0);
  //reset upgrades
  for (var i = 0; i < purchasedupgrades.length; i++) {
    document.getElementById("upgrade" + purchasedupgrades[i]).style = "background-color: #2e2380;";
  }
  purchasedupgrades = [];
  //reset achievements
  const elements = document.getElementsByClassName("earned");
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("earned");
  }
  achieved = [];

  document.getElementById("coopsize").innerText = coopsize.toString();
  document.getElementById("coopprice").innerText = coopprice.toString();
  document.getElementById("chickens").innerText = chickens.toString();
  document.getElementById("moneybutton").style = "display: none;";

  Update();
}
function Increment() {
  if (hatchmode) {
    for (var i = 0; i < hatchamount; i++) {
      if (score.sub(1).lt(0)) {
        Hatch();
        return;
      }
      score = score.sub(1);
      if (Math.floor(Math.random() * 100) <= hatchchance) {//0-99 
        chickens = chickens.add(1)
        document.getElementById("chickens").innerText = chickens.toString();
        if (chickens.gte(coopsize)) {
          chickens = coopsize
          document.getElementById("chickens").innerText = chickens.toString();
          Hatch();
          return;
        }
      }
    }
  }
  else {
    let actives = OmegaNum(1);
    if (purchasedupgrades.includes("m4") & purchasedupgrades.includes("m2")) actives = actives.plus(money.add(1).sqrt().mul(3).round());
    else if (purchasedupgrades.includes("m2")) actives = actives.plus(money.add(1).sqrt().round());
    score = score.plus(chickens.mul(eggmultiplier).mul(actives));
  }
  minitrembles = minitrembles.add(magnifiers.div(1000));
  document.getElementById("minitrembleboost").innerText = minitrembles.toString();
  document.getElementById("trembleeffect").innerText = OmegaNum(2).pow(minitrembles.add(1)).toString();
  Update();
}

function Coop() {
  if (score.gte(coopprice)) {
    score = score.sub(coopprice);
    coopsize = coopsize.mul(2);
    coopprice = coopprice.mul(5);
    document.getElementById("coopsize").innerText = coopsize.toString();
    document.getElementById("coopprice").innerText = coopprice.toString();
    Achieve(2);
  }
}

function Hatch() {
  hatchmode = !hatchmode;
  if (hatchmode) {
    document.getElementById("hatch").innerText = "Hatch Mode";
  }
  else {
    document.getElementById("hatch").innerText = "Egg Mode";
  }
}

function Sell() {
  //money = 1000 eggs
  money = money.add(score.div(1000).floor());
  if (purchasedupgrades.includes("e7")) money = money.mul(2);
  score = OmegaNum(0);
  chickens = OmegaNum(1);
  document.getElementById("monies").innerText = money.toString();
  if (purchasedupgrades.includes("m4")) {
    let effect = money.add(1).sqrt().mul(3).round();
    if (effect.gte(3000000)) {
      effect = "3e6 (CAPPED)";
    }
    document.getElementById("m2effect").innerText = effect
  } else {
    let effect = money.add(1).sqrt().round();
    if (effect.gte(1000000)) {
      effect = "1e6 (CAPPED)";
    }
    document.getElementById("m2effect").innerText = effect
  }
  document.getElementById("chickens").innerText = chickens.toString();
  Achieve(4);
  Update();
}

function Switch(layer) {
  document.getElementById("chick").style = "display: none;";
  document.getElementById("money").style = "display: none;";
  document.getElementById("settings").style = "display: none;";
  document.getElementById("time").style = "display: none;";
  document.getElementById("achievements").style = "display: none;";
  document.getElementById(layer).style = "display: block;";

  document.getElementById("chickbutton").classList.remove("active");
  document.getElementById("moneybutton").classList.remove("active");
  document.getElementById("settingsbutton").classList.remove("active");
  document.getElementById("timebutton").classList.remove("active");
  document.getElementById("achievementsbutton").classList.remove("active");
  document.getElementById(layer + "button").classList.add("active");
}

function Unlock(layer) {
  document.getElementById(layer + "button").style = "display: block;";
}

function Achieve(num) {
  num -= 1;
  if (achieved.includes(num)) return;
  const achievementBlocks = document.querySelectorAll(".achievement-block");
  if (num >= 0 && num < achievementBlocks.length) {
    achievementBlocks[num].classList.add("earned");
  }
  achieved.push(num);
  if (num == 3) {
    for (var i = 6; i <= 10; i++) {
      document.getElementById("upgradee" + i).style += "display: inline-block;";
    }
  }
}

function Warp() {
  score = OmegaNum(1000);
  chickens = OmegaNum(1);
  coopsize = OmegaNum(10);
  coopprice = OmegaNum(100);
  eggmultiplier = OmegaNum(1);
  hatchmode = false;
  hatchchance = OmegaNum(10);
  hatchamount = OmegaNum(1);
  //reset upgrades
  for (var i = 0; i < purchasedupgrades.length; i++) {
    document.getElementById("upgrade" + purchasedupgrades[i]).style = "background-color: #2e2380;";
  }
  purchasedupgrades = [];
  document.getElementById("coopsize").innerText = coopsize.toString();
  document.getElementById("coopprice").innerText = coopprice.toString();
  document.getElementById("chickens").innerText = chickens.toString();
  document.getElementById("moneybutton").style = "display: none;";

  magnifiers = magnifiers.add(money.div(1000).floor())
  money = OmegaNum(0);
  clearInterval(chickens_interval);
  chickens_interval = setInterval(Increment, 1000 / magnifiers.toNumber());
  Update();
  document.getElementById("magnifiers").innerText = magnifiers.toString();
}
