var myMap; // Переменная, хранящая карту
var list1 = []; // Переменаня, хранящая основной список точек

ymaps.ready(init);

function init() {

    myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 9
    }, {
        searchControlProvider: 'yandex#search'
    });



}
// Функции обработки перетаскивания элементов списка
function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
    e.preventDefault();
    var from= Number(e.dataTransfer.getData("text").substring(2)),
        to = Number(e.target.id.substring(2));
    if (from > to ) {
        list1.splice(to, 0, list1[from]);
        list1.splice(from+1, 1);
    }
    else {
        list1.splice(to, 0, list1[from]);
        list1.splice(from, 1);
    }

    redrawList(list1);
}
// Обработчик нажатия кнопки удаления элемента списка
function deleteElem(arg) {
    var i = Number(arg.id.substring(4));
    console.log(arg.id);
    list1.splice(i,1);
    redrawList(list1);
}
// Функция перерисовки списка и карты
function redrawList(args) {
    var tmptable = document.getElementById("table");
    var tmprow = tmptable.lastChild;
    var tmpcol,tmpbutton;
    var line, linearray = [];
    // Очищаем таблицу
    while ( tmprow != null) {
        tmptable.removeChild(tmprow);
        tmprow = tmptable.lastChild;
    }
    // Очищаем карту
    myMap.geoObjects.removeAll();

    // Формируем и выводим список и карту
    for (i = 0; i < args.length; i++) {
        tmprow = document.createElement("tr");
        tmprow.className="tr";
        tmprow.draggable=true;
        tmprow.addEventListener("dragover",allowDrop, false);
        tmprow.addEventListener("drop",drop, false);
        tmprow.addEventListener("dragstart",drag, false);

        tmprow.id="tr"+i;
        tmpcol = document.createElement("td");
        tmpcol.className="td";
        tmpcol.innerText=args[i].name;
        tmpcol.id="td"+i;
        tmprow.appendChild(tmpcol);
        tmpcol=document.createElement("td");
        tmpbutton=document.createElement("input");
        tmpbutton.value="x";
        tmpbutton.id="butt"+i;
        tmpbutton.type="button";
        tmpbutton.onclick=function() {deleteElem(this);};
        tmpcol.appendChild(tmpbutton);
        tmprow.appendChild(tmpcol);
        tmptable.appendChild(tmprow);

        // Рисуем точки
        myMap.geoObjects.add(args[i].point);
        // Создаем массив для отрисовки линий
        linearray.push(args[i].coords);

    }
    // Рисуем линии
    line = new ymaps.Polyline(linearray);
    myMap.geoObjects.add(line);
}

// Констурктор класса основного списка
function MyList(name, coords, baloon, point) {
    this.name = name;
    this.coords = coords;
    this.baloon = baloon;
    this.point = point;
}

// Функция добавления точки
function addPoint(myinput) {

    myPlacemark = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: myMap.getCenter()
        },
        // Свойства.
        properties: {
            // Контент метки.
            iconContent: '',
            hintContent: myinput.point.value,
            balloonContent: myinput.point.value
        }
    }, {
        // Опции.
        // Иконка метки будет растягиваться под размер ее содержимого.
        preset: 'islands#blackStretchyIcon',
        // Метку можно перемещать.
        draggable: true
    });
    myPlacemark.events.add("dragend", function(e) {endMove(e);});
    tmpelem = new MyList(myinput.point.value,myMap.getCenter(),myinput.point.value,myPlacemark);
    list1.push(tmpelem);
    myinput.point.value="";
    redrawList(list1);
    return false;
}

function endMove(e) {
    var myPlacemark = e.get('target');
    for (i=0;i<list1.length;i++) {
        if (list1[i].point == myPlacemark) {
            list1[i].coords = myPlacemark.geometry.getCoordinates();
            break;
        }
    }
    redrawList(list1);

}
