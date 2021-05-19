var restaurants = new Array();
let columnCount = 3;

window.onload = function () {
    loadJsonFile();
}

/**
 * 載入 JSON 檔案資料
 * @return {Array} 所有餐廳資料 
 */
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

/**
 * 初始化行政區域下拉式選單
 */
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

/**
 * 初始化鄉鎮區下拉式選單
 * @param {string} city 行政區域
 */
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

/**
 * 初始化內容
 */
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

/**
 * 新增一個 HTML Element
 * @param {string} parentID 父元素 ID
 * @param {string} tagName HTML Tag 名稱
 * @param {string} id Element ID
 * @param {string} elementClass Element Class
 * @param {string} text 呈現的文字
 * @example 
 * addElement("content", "div", "row0", "row", "");
 */
function addElement(parentID, tagName, id, elementClass, text) {
    var element = document.createElement(tagName);
    var textNode = document.createTextNode(text);
    element.setAttribute("id", id);
    element.setAttribute("class", elementClass);
    element.appendChild(textNode);

    document.getElementById(parentID).appendChild(element);
}

/**
 * 新增內容區塊
 * @param {string} parentRowId 父元素 ID
 * @param {int} i 計數器
 * @param {Restaurant} r 一間餐廳
 * @example 
 * addBlock("row0", 1, {Restaurant});
 */
function addBlock(parentRowId, i, r) {
    setBlockAttribute(parentRowId, "div", `block${i}`, "block");
    addElement(`block${i}`, "div", `photo${i}`, "block__photo", "");
    addImage(`photo${i}`, `img${i}`, "photo__img", r.PicURL);
    addElement(`block${i}`, "div", `cover${i}`, "block__cover", "");
    addElement(`block${i}`, "div", `city${i}`, "block__city", "");
    addElement(`city${i}`, "p", `city${i}`, "city", r.City);

    addElement(`block${i}`, "div", `intro${i}`, "block__intro", "");
    addElement(`intro${i}`, "p", `town${i}`, "intro__town", r.Town);
    addElement(`intro${i}`, "p", `restaurant${i}`, "intro__restaurant", r.Name);
    addElement(`intro${i}`, "div", `dash${i}`, "intro__dash", "");
    addElement(`intro${i}`, "p", `detail${i}`, "intro__detail", r.HostWords);
}

/**
 * 新增空白區塊
 * @param {string} parentRowId 父元素 ID
 * @param {int} i 計數器
 * @example
 * addEmptyBlock("row0", 1);
 */
function addEmptyBlock(parentRowId, i) {
    if (i % columnCount == 1) {
        for (var j = 0; j < 2; j++) {
            setBlockAttribute(parentRowId, "div", "block" + (i + j), "block block--empty");
        }
    } else if (i % columnCount == 2) {
        setBlockAttribute(parentRowId, "div", `block${i}`, "block block--empty");
    }
}

/**
 * 設定區塊屬性
 * @param {string} parentID 父元素 ID
 * @param {string} tagName HTML Tag 名稱
 * @param {string} id Element ID
 * @param {string} elementClass Element Class
 * @example
 * setBlockAttribute("row0", "div", "block0", "block");
 */
function setBlockAttribute(parentID, tagName, id, elementClass) {
    var element = document.createElement(tagName);
    var contentWidth = document.getElementById("content").offsetWidth;
    var blockWidth = Math.ceil(contentWidth / columnCount);
    var blockHeight = blockWidth * 2 / 4;

    element.setAttribute("id", id);
    element.setAttribute("class", elementClass);
    element.setAttribute("style", `width:${blockWidth}px; height:${blockHeight}px;`);

    document.getElementById(parentID).appendChild(element);
}

/**
 * 新增圖片
 * @param {string} parentID 父元素 ID
 * @param {string} id Element ID
 * @param {string} elementClass Element Class
 * @param {string} src 圖片來源
 * @example
 * addImage("photo0", "img0", "photo__img", "./image/example.jpg");
 */
function addImage(parentID, id, elementClass, src) {
    var element = document.createElement("img");
    element.setAttribute("id", id);
    element.setAttribute("class", elementClass);
    element.setAttribute("src", src);

    document.getElementById(parentID).appendChild(element);
}

/**
 * 行政區域下拉式選單異動
 */
function changeCity() {
    var cityDropDownList = document.getElementById("city");
    city = cityDropDownList.options[cityDropDownList.selectedIndex].value;
    initialTownDropDownList(city);
    getContent(city, "city");
}

/**
 * 鄉政區下拉式選單異動
 */
function changeTown() {
    var townDropDownList = document.getElementById("town");
    town = townDropDownList.options[townDropDownList.selectedIndex].value;
    getContent(town, "town");
}

/**
 * 根據下拉式選單選項取得內容
 * @param {string} item 選取的選項
 * @param {string} type 選取的類型
 * @example
 * getContent("北屯區", "town");
 */
function getContent(item, type) {
    var index = 0;

    document.getElementById("content").innerHTML = "";
    switch (type) {
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

/**
 * 取得選取的行政區域內的餐廳
 * @param {string} city 行政區域
 * @param {int} index 索引值
 * @example
 * getCityContent("花蓮市", 1);
 * @return {int} 索引值
 */
function getCityContent(city, index) {
    restaurants.forEach(r => {
        index = optionCompare(index, r.City, city, r)
    });
    return index;
}

/**
 * 取得選取的鄉鎮區內的餐廳
 * @param {string} town 鄉鎮區
 * @param {int} index 索引值
 * @example
 * getTownContent("鳳山區", 1);
 * @return {int} 索引值
 */
function getTownContent(town, index) {
    restaurants.forEach(r => {
        index = optionCompare(index, r.Town, town, r)
    });
    return index;
}

/**
 * 取得選取的行政區域/鄉政區內的餐廳
 * @param {int} index 索引值
 * @param {string} sample 餐廳行政區域/鄉鎮區
 * @param {string} target 選取的行政區域/鄉鎮區
 * @param {Restaurant} r 一間餐廳
 * @example
 * optionCompare(1, "雲林縣", "雲林縣", "古早雞傳統米食");
 * @example
 * optionCompare(1, "花壇鄉", "花壇鄉", "艾馨園");
 * @return {int} index 
 */
function optionCompare(index, sample, target, r) {
    if (sample == target) {
        if (index % columnCount == 0) {
            addElement("content", "div", "row" + (Math.floor(index / columnCount)), "row", "");
        }
        addBlock("row" + (Math.floor(index / columnCount)), index, r);
        index = ++index;
    }
    return index;
}