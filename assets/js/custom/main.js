var films;

$(document).ready(function() {
    loadFile();
});

// Conectar y recibir los datos del JSON
function loadFile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var file = xhttp.responseText;
        films = JSON.parse(file);
    };
    xhttp.open("GET", "assets/js/custom/films.json", false);
    xhttp.send();

    createItems();
}

// Crear los elementos en el html
function createItems() {
    for (var i in films) {
        var $item =
            "<div id='" + i + "' class='film'>" +
            "<img src='" + films[i].caratula + "' title='Película: " + films[i].titulo + "' alt='Película: " + films[i].titulo + "'>" +
            "<h2 class='title-film'>" + films[i].titulo +
            "</h2></div>";
        $("#films").append($item);
    }
    chooseFilm();
}

// Interactuar con las peliculas
function chooseFilm() {
    var $item;
    $(".film").on("click", function(event) {
        $item = event.currentTarget;
        localStorage.setItem("filmID", $item.id);
        location.href = "details.html";
    });

    $(".film").on("keydown", function(event) {
        if (event.keyCode === 13) {
            $item = event.currentTarget;
            localStorage.setItem("filmID", $item.id);
            location.href = "details.html";
        }
    });
}