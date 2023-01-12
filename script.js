var score = OmegaNum(100000);
var chickens = OmegaNum(1);
var coopsize = OmegaNum(10);
var coopprice = OmegaNum(100);

var chickens_interval = setInterval(Increment, 1000);
var inc_buff = OmegaNum(1);

var hatchmode = false;
var hatchchance = OmegaNum(10); //percent
var hatchamount = OmegaNum(1);

//cost, effect, type
var upgrades = [[30, 5, "h"], 
								[90, 10, "h"], 
								[150, 15, "h"],
							  [500, 2, "a"]];
var upsbought = [];
var upscounter = 0;
//h = hatch chance
//a = hatch amount
//i = interval (update rate)

var money = OmegaNum(0);

Update();

function Update() {
  document.getElementById("score").innerText = score.toString();
  if (score.gte(1000)) {
    document.getElementById("sell").disabled = false;
  } else {
    document.getElementById("sell").disabled = true;
  }
	if (Math.floor(Math.random() * 100000) == 777) {
		document.title = "I SEE YOU";
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
    score = score.add(chickens);
  }
  Update();
}

function Coop() {
  if (score.gte(coopprice)) {
    score = score.sub(coopprice);
    coopsize = coopsize.mul(5);
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

function BuyUpgrade(num) {
	let upgrade = upgrades[num-1];
	if (score < upgrade[0]) return false;
	score = score.sub(upgrade[0]);
	if (upgrade[2] == "h") hatchchance = hatchchance.add(upgrade[1]);
	else if (upgrade[2] == "a") hatchamount = hatchamount.add(upgrade[1]);
	else {
			inc_buff = inc_buff.mul(upgrade[1]);
			clearInterval(chickens_interval);
			chickens_interval = setInterval(Increment, 1000/inc_buff);	
	}
	return true;
}

function Upgrade(num) {
	if (upsbought.includes(num)) return;
	let bought = BuyUpgrade(num)
	if (bought) {
		document.getElementsByClassName(num)[0].style = "background-color: green; color: black;";
    document.getElementById("hatchchance").innerText = hatchchance.toString();
		upsbought[upscounter] = num;
		upscounter++;
	}
}

function Sell() {
  //money = 1000 eggs
  money = money.add(score.div(1000).floor());
  score = OmegaNum(0);
  document.getElementById("money").innerText = money.toString();
  Update();
}