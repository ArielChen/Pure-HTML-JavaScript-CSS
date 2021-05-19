var restaurants = new Array();
let columnCount = 3;

window.onload = function () {
    loadJsonFile();
}

function setBlockAttribute(parentID, tagName, id, elementClass, text) {
    var element = document.createElement(tagName);
    var textNode = document.createTextNode(text);
    var contentWidth = document.getElementById("content").offsetWidth; //1739
    var blockWidth =  Math.ceil(contentWidth / columnCount); //blockWidth = 525.6666666666666, contentWidth = 173
    var blockHeight = blockWidth * 2 / 4;

    element.setAttribute("id", id);
    element.setAttribute("class", elementClass);
    element.setAttribute("style", `width:${blockWidth}px; height:${blockHeight}px;`);
    element.appendChild(textNode);

    document.getElementById(parentID).appendChild(element);
}

function changeCity() {    
    var cityDropDownList = document.getElementById("city");
    city = cityDropDownList.options[cityDropDownList.selectedIndex].value;
    initialTownDropDownList(city);
    getContent(city, "city");
}

function changeTown() {
    var townDropDownList = document.getElementById("town");
    town = townDropDownList.options[townDropDownList.selectedIndex].value;
    getContent(town, "town");
}

function getContent(item, option) {
    var index = 0;

    document.getElementById("content").innerHTML = "";
    switch (option) {
        case "city":
            index = getCityContent(item, index);
            break;
        case "town":
            index = getTownContent(item, index);
            break;
        default:
            index = 0;
            break;
    }
    
    addEmptyBlock("row" + (Math.floor(index / columnCount)), index);
}

function getCityContent(city, index) {
    restaurants.forEach(r => {
        index = optionCompare(index, r.City, city, r)
    });
    return index;
}

function getTownContent(town, index) {
    restaurants.forEach(r => {
        index = optionCompare(index, r.Town, town, r)
    });
    return index;
}

function loadJsonFile() {

    var requestURL = 'Data.json';
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            for (var i = 0; i < json.length; i++) {
                var a = new Restaurant(json[i]);
                restaurants.push(a);
            }
            initialCityDropDownList();
            initialContent();

            document.getElementById("loading").remove();
        }
    }

    xhr.open('GET', requestURL);
    xhr.send();

    return restaurants;
}

function initialCityDropDownList() {
    var city = document.getElementById("city");
    var cityArray = new Array();

    restaurants.forEach(element => {
        cityArray.push(element.City);
    });

    const distinctCities = Array.from(new Set(cityArray));
    distinctCities.forEach(element => {
        city.add(new Option(element));
    });
}

function initialTownDropDownList(city) {
    var town = document.getElementById("town");
    var townArray = new Array();

    town.querySelectorAll("option").forEach(town => town.remove());
    town.add(new Option("請選擇鄉鎮區...", "default", true, true));
    town.options[0].disabled = true;

    restaurants.forEach(element => {
        if (element.City == city) {
            townArray.push(element.Town);
        }
    });

    const distinctTowns = Array.from(new Set(townArray));
    distinctTowns.forEach(element => {
        town.add(new Option(element));
    });
}

function initialContent() {
    var length = restaurants.length;
    restaurants.forEach((r, index) => {
        if (index % columnCount == 0) {
            addElement("content", "div", "row" + (Math.floor(index / columnCount)), "row", "");
        }
        addBlock("row" + (Math.floor(index / columnCount)), index, r);
    });
    addEmptyBlock("row" + (Math.floor(length / columnCount)), length);
}

function optionCompare(i, sample, target, r) {
    if (sample == target) {
        if (i % columnCount == 0) {
            addElement("content", "div", "row" + (Math.floor(i / columnCount)), "row", "");
        }
        addBlock("row" + (Math.floor(i / columnCount)), i, r);
        i = ++i;
    }
    return i;
}

function addBlock(parentRowId, i, r) {
    setBlockAttribute(parentRowId, "div", `block${i}`, "block", "");
    addElement(`block${i}`, "div", `photo${i}`, "block__photo", "");
    addImage(`photo${i}`, "img", `img${i}`, "photo__img", "", r.PicURL);
    addElement(`block${i}`, "div", `cover${i}`, "block__cover", "");
    addElement(`block${i}`, "div", `city${i}`, "block__city", "");
    addElement(`city${i}`, "p", `city${i}`, "city", r.City);

    addElement(`block${i}`, "div", `intro${i}`, "block__intro", "");
    addElement(`intro${i}`, "p", `town${i}`, "intro__town", r.Town);
    addElement(`intro${i}`, "p", `restaurant${i}`, "intro__restaurant", r.Name);
    addElement(`intro${i}`, "div", `dash${i}`, "intro__dash", "");
    addElement(`intro${i}`, "p", `detail${i}`, "intro__detail", r.HostWords);
}

// function addBlock(parentID, tagName, id, elementClass) {
//     var element = document.createElement(tagName);
//     var textNode = document.createTextNode(text);
//     element.setAttribute("id", id);
//     element.setAttribute("class", elementClass);
//     element.appendChild(textNode);

//     document.getElementById(parentID).appendChild(element);
// }

function addEmptyBlock(parentRowId, i) {
    if (i % columnCount == 1) {
        for (var j = 0; j < 2; j++) {
            addElement(parentRowId, "div", "block" + ( i + j ), "block block--empty", "");
        }
    } else if (i % columnCount == 2) {
        addElement(parentRowId, "div", `block${i}`, "block block--empty", "");
    }
}

function addImage(parentID, tagName, id, elementClass, text, src) {
    var element = document.createElement(tagName);
    var textNode = document.createTextNode(text);
    element.setAttribute("id", id);
    element.setAttribute("class", elementClass);
    element.setAttribute("src", src);
    element.appendChild(textNode);

    document.getElementById(parentID).appendChild(element);
}

function addElement(parentID, tagName, id, elementClass, text) {
    var element = document.createElement(tagName);
    var textNode = document.createTextNode(text);
    element.setAttribute("id", id);
    element.setAttribute("class", elementClass);
    element.appendChild(textNode);

    document.getElementById(parentID).appendChild(element);
}