var score = OmegaNum(0);
var chickens = OmegaNum(1);
var coopsize = OmegaNum(10);
var coopprice = OmegaNum(100);

var chickens_interval = setInterval(Increment, 1000);
var inc_buff = OmegaNum(1);

var hatchmode = false;
var hatchchance = OmegaNum(10); //percent
var hatchamount = OmegaNum(1);

//cost, effect, type
var upgradecost = [30, 90, 150, 500, 1000];
var upgradesbought = [false, false, false, false, false];
var moneyupgrades = [false];
//h = hatch chance
//a = hatch amount
//i = interval (update rate)
//l = layer

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

function Save() {
  localStorage.setItem("score", score.toString());
  localStorage.setItem("chickens", chickens.toString());
  localStorage.setItem("coopsize", coopsize.toString());
  localStorage.setItem("coopprice", coopprice.toString());
  localStorage.setItem("hatchmode", hatchmode.toString());
  localStorage.setItem("money", money.toString());
  localStorage.setItem("upgradesbought", upgradesbought.toString());
  localStorage.setItem("moneyupgrades", moneyupgrades.toString());
  localStorage.setItem("inc_buff", inc_buff.toString());
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
  upgradesbought = localStorage.getItem("upgradesbought").split(",");
  moneyupgrades = localStorage.getItem("moneyupgrades").split(",");
  inc_buff = OmegaNum(localStorage.getItem("inc_buff"));
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
  for (var i = 0; i < upgradesbought.length; i++) {
    if (upgradesbought[i] == "true") {
      Upgrade("c", i, true);
    }
  }
}

function Reset() {
  score = OmegaNum(0);
  chickens = OmegaNum(1);
  coopsize = OmegaNum(10);
  coopprice = OmegaNum(100);
  hatchmode = false;
  hatchchance = OmegaNum(10);
  hatchamount = OmegaNum(1);
  upgradesbought = [false, false, false, false, false];
  moneyupgrades = [false];
  money = OmegaNum(0);
  Update();
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
    let mult = OmegaNum(1);
    if (moneyupgrades[0]) mult = mult.plus(1);
    score = score.add(chickens).mul(mult);
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

function Upgrade(layer, num, free=false) {
  num -= 1;
  let bought = false;
	switch (layer) {
    case "c": //chicken upgrades
      if ((score.gte(upgradecost[num]) && !upgradesbought[num]) || free) {
        bought = true;
        score = score.sub(upgradecost[num]);
        upgradesbought[num] = true;
        UpgradeEffect(layer, num);
      }
    }
  if (bought) {
    num += 1;
    document.getElementsByClassName(layer + num)[0].style = "background-color: green";
  }
}

function UpgradeEffect(layer, num) {
  switch (layer) {
    case "c": //chicken upgrades
      switch (num) {
        case 0, 1, 2:
          hatchchance = hatchchance.plus((num + 1) * 5);
          document.getElementById("hatchchance").innerText = hatchchance.toString();
          break;
        case 3:
          hatchamount = hatchamount.plus(2);
          break;
        case 4:
          Unlock("money");
          break;
      }
    case "m": //money upgrades
      switch (num) {
        //0 is handled
        default:
          break;
      }
    }
}

function Sell() {
  //money = 1000 eggs
  money = money.add(score.div(1000).floor());
  score = OmegaNum(0);
  document.getElementById("monies").innerText = money.toString();
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
