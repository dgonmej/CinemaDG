var films, seats;

$(document).ready(function() {
    loadFilmsFile();
    loadSeatsFile();
    getDataFilm()
});

// Conectar y recibir los datos del JSON de películas
function loadFilmsFile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var file = xhttp.responseText;
        films = JSON.parse(file);
    };
    xhttp.open("GET", "assets/js/custom/films.json", false);
    xhttp.send();
}

// Conectar y recibir los datos del JSON de butacas
function loadSeatsFile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var file = xhttp.responseText;
        seats = JSON.parse(file);
    };
    xhttp.open("GET", "assets/js/custom/seats.json", false);
    xhttp.send();
}

// Administrar la informacióon del localStore
function getDataFilm() {
    var filmData = [];
    var filmID = localStorage.getItem("filmID");
    for (var i in films) {
        if (i == filmID) {
            filmData.push(films[i]);
        }
        if (localStorage.getItem(i) == null) {
            for (var i in films) {
                var tittle = [films[i].titulo];
                localStorage.setItem(i, tittle);
            }
        }
    }

    // Rellenamos todas las sesiones con las butacas
    var sessionCounter = 1;
    for (var i in films) {
        var sessions = films[i].sesiones;
        var tittle = films[i].titulo;
        for (var i = 0; i < sessions.length; i++) {
            if (localStorage.getItem("session_" + sessionCounter) == null) {
                var sessionFilm = [sessions[i], tittle, seats];
                localStorage.setItem("session_" + sessionCounter, JSON.stringify(sessionFilm));
            }
            sessionCounter++;
        }
    }
    insertInfomation(filmData);
}

// Insertar la información en la página
function insertInfomation(filmData) {
    $("#titleFilm .emphasis").text(filmData[0].titulo);
    $("#premiereFilm .emphasis").text(filmData[0].estreno);
    $("#kindFilm .emphasis").text(filmData[0].genero);
    $("#cover").attr({ "src": filmData[0].caratula, "alt": "Carátula de " + filmData[0].titulo, "title": filmData[0].titulo });
    $("#synopsisFilm .emphasis").text(filmData[0].sipnosis);
    $("#b_trailer").attr("href", filmData[0].trailer);

    var showtimes = filmData[0].sesiones;
    for (var i = 0; i < showtimes.length; i++) {
        $("#sessions").append("<button id='session_" + i + "' class='button' data-session='" + showtimes[i] + "'>" + showtimes[i] + "</button>")
    }
    $('#sessions').on('click', 'button', function() {
        chooseSession(filmData, $(this).attr('data-session'));
    })
}

// Elegir la sesión de la película y redireccionar a la página de elegir asientos //
function chooseSession(filmData, session) {
    var sessionCounter = 1;
    for (var i in films) {
        var sessions = films[i].sesiones;
        for (var i = 0; i < sessions.length; i++) {
            var roomSession = localStorage.getItem('session_' + sessionCounter);
            roomSession = JSON.parse(roomSession);
            if (roomSession[0] == session && roomSession[1] == filmData[0].titulo) {
                var sessionID = 'session_' + sessionCounter;
                localStorage.setItem('sessionID', sessionID);
                location.href = "film.html";
            }
            sessionCounter = sessionCounter + 1;
        }
    }
}