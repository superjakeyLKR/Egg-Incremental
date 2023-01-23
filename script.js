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
        hatchchance = hatchchance.plus(3);
      },
      currency: "money"
    },
    "m4": {
      cost: 50,
      effect: function() {
        if (purchasedupgrades.includes("m1")) {
          eggmultiplier = eggmultiplier.mult(3);
        } else {
          eggmultiplier = eggmultiplier.add(2);
        }
      },
      currency: "money"
    },
};
var money = OmegaNum(0);

Update();

function Update() {
  document.getElementById("score").innerText = score.toString();
  if (score.gte(1000)) {
    document.getElementById("sell").disabled = false;
    document.getElementById("sell").innerText = "Sell Eggs (" + score.div(1000).floor().toString() + " money)";
  } else {
    document.getElementById("sell").disabled = true;
    document.getElementById("sell").innerText = "Sell Eggs";
  }
	if (Math.floor(Math.random() * 100000) == 777) {
		document.title = "I SEE YOU";
	}
}

function Upgrade(id) {
  let bought = false
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
  purchasedupgrades = localStorage.getItem("purchased_upgrades").split(",");
  document.getElementById("coopsize").innerText = coopsize.toString();
  document.getElementById("coopprice").innerText = coopprice.toString();
  if (hatchmode) {
    document.getElementById("hatch").innerText = "Hatch Mode";
  }
  else {
    document.getElementById("hatch").innerText = "Egg Mode";
  }
  document.getElementById("monies").innerText = money.toString();
  Update();
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
  ResetUpgrades();
  purchasedupgrades = [];
  money = OmegaNum(0);

  document.getElementById("moneybutton").style = "display: none;";

  Update();
}

function ResetUpgrades() {
  for (var i = 0; i < purchasedupgrades.length; i++) {
    document.getElementById("upgrade" + purchasedupgrades[i]).style = "background-color: #2e2380;";
  }
}
function Increment() {
  if (hatchmode) {
    for (var i = 0; i < hatchamount; i++) {
      if (score.sub(hatchamount).lt(0)) {
        Hatch();
        return;
      }
      score = score.sub(hatchamount);
      if (Math.floor(Math.random() * 100) <= hatchchance) {//0-99 
        chickens = chickens.add(1)
        document.getElementById("chickens").innerText = chickens.toString();
        if (chickens.gt(coopsize)) {
          chickens = coopsize
          Hatch();
          return;
        }
      }
    }
  }
  else {
    let actives = OmegaNum(1);
    if (purchasedupgrades.includes("m4")) actives.plus(money.add(1).mul(3).sqrt());
    else if (purchasedupgrades.includes("m2")) actives.plus(money.add(1).sqrt());
    score = score.plus(chickens.mul(eggmultiplier).mul(actives));
  }
  Update();
}

function Coop() {
  if (score.gte(coopprice)) {
    score = score.sub(coopprice);
    coopsize = coopsize.mul(2);
    coopprice = coopprice.mul(5);
    document.getElementById("coopsize").innerText = coopsize.toString();
    document.getElementById("coopprice").innerText = coopprice.toString();
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
  score = OmegaNum(0);
  chickens = OmegaNum(1);
  ResetUpgrades();
  purchasedupgrades = [];
  document.getElementById("monies").innerText = money.toString();
  document.getElementById("m2effect").innerText = money.add(1).sqrt();
  Update();
}

function Switch(layer) {
  document.getElementById("chick").style = "display: none;";
  document.getElementById("money").style = "display: none;";
  document.getElementById("settings").style = "display: none;";
  document.getElementById(layer).style = "display: block;";

  document.getElementById("chickbutton").classList.remove("active");
  document.getElementById("moneybutton").classList.remove("active");
  document.getElementById("settingsbutton").classList.remove("active");
  document.getElementById(layer + "button").classList.add("active");
}

function Unlock(layer) {
  document.getElementById(layer + "button").style = "display: block;";
}
