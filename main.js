var restaurants = new Array();

function loadJsonFile() {
    var requestURL = 'Data.json';
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);

            for (var i = 0; i < json.length; i++) {
                var a = new Restaurant(json[i]);
                restaurants.push(a);
            }
            initialCityOptions();
            initialContent();

            document.getElementById("loading").remove();
        }
    }

    xhr.open('GET', requestURL);
    xhr.send();

    return restaurants;
}

function initialCityOptions() {
    var city = document.getElementById("city");
    var data = new Array();

    restaurants.forEach(element => {
        data.push(element.City);
    });

    const distinctCities = Array.from(new Set(data));
    distinctCities.forEach(element => {
        city.add(new Option(element));
    });
}

function initialTownOptions(city) {
    var town = document.getElementById("town");
    var data = new Array();

    town.length = 0;
    town.add(new Option("請選擇鄉鎮區...", "default", true, true));
    town.options[0].disabled = true;

    restaurants.forEach(element => {
        if (element.City == city) {
            data.push(element.Town);
        }
    });

    const distinctTowns = Array.from(new Set(data));
    distinctTowns.forEach(element => {
        town.add(new Option(element));
    });
}

function initialContent() {
    var length = restaurants.length;
    restaurants.forEach((r, index) => {
        if (index % 3 == 0) {
            this.addElement("content", "div", "row" + (Math.floor(index / 3)), "row", "");
        }
        this.addBlock("row" + (Math.floor(index / 3)), index, r);
    });
    addEmptyBlock("row" + (Math.floor(length / 3)), length);
}

function reloadContent(city, town) {
    var i = 0;
    document.getElementById("content").innerHTML = "";

    if (city != null) {
        restaurants.forEach((r) => {
            i = optionCompare(i, r.City, city, r)
        });
    } else if (town != null) {
        restaurants.forEach((r) => {
            i = optionCompare(i, r.Town, town, r)
        });
    }

    addEmptyBlock("row" + (Math.floor(i / 3)), i);
}

function optionCompare(i, sample, target, r) {
    if (sample == target) {
        if (i % 3 == 0) {
            this.addElement("content", "div", "row" + (Math.floor(i / 3)), "row", "");
        }
        this.addBlock("row" + (Math.floor(i / 3)), i, r);
        i = ++i;
    }
    return i;
}

function addBlock(parentRowID, i, r) {
    this.addElement(parentRowID, "div", "block" + i, "block", "");
    this.addElement("block" + i, "div", "photo" + i, "block__photo", "");
    this.addImage("photo" + i, "img", "img" + i, "photo__img", "", r.PicURL);
    this.addElement("block" + i, "div", "cover" + i, "block__cover", "");
    this.addElement("block" + i, "div", "city" + i, "block__city", "");
    this.addElement("city" + i, "p", "city" + i, "city", r.City);

    this.addElement("block" + i, "div", "intro" + i, "block__intro", "");
    this.addElement("intro" + i, "p", "town" + i, "intro__town", r.Town);
    this.addElement("intro" + i, "p", "restaurant" + i, "intro__restaurant", r.Name);
    this.addElement("intro" + i, "div", "dash" + i, "intro__dash", "");
    this.addElement("intro" + i, "p", "detail" + i, "intro__detail", r.HostWords);
}

function addEmptyBlock(parentRowID, i) {
    if (i % 3 == 1) {
        for (var j = 0; j < 2; j++) {
            this.addElement(parentRowID, "div", "block" + i, "block block--empty", "");
        }
    } else if (i % 3 == 2) {
        this.addElement(parentRowID, "div", "block" + i, "block block--empty", "");
    }
}

function addImage(parentID, tagName, id, cls, text, src) {
    var element = document.createElement(tagName);
    var textNode = document.createTextNode(text);
    element.setAttribute("id", id);
    element.setAttribute("class", cls);
    element.setAttribute("src", src);
    element.appendChild(textNode);

    document.getElementById(parentID).appendChild(element);
}

function addElement(parentID, tagName, id, cls, text) {
    var element = document.createElement(tagName);
    var textNode = document.createTextNode(text);
    element.setAttribute("id", id);
    element.setAttribute("class", cls);
    element.appendChild(textNode);

    document.getElementById(parentID).appendChild(element);
}

window.onload = function () {
    this.loadJsonFile();

    var citySelect = document.getElementById("city");
    var townSelect = document.getElementById("town");

    citySelect.onchange = function () {
        city = citySelect.options[citySelect.selectedIndex].value;
        initialTownOptions(city);
        reloadContent(city, null);
    }

    townSelect.onchange = function () {
        town = townSelect.options[townSelect.selectedIndex].value;
        reloadContent(null, town);
    }
}