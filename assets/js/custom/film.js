var films, seats, sessionID, sessionData;
var price = 0;
var ticketCounter = 0;
var seatIDs = [];

$(document).ready(function() {
    $("#tabs").tabs();
    $(document).tooltip({
        track: true
    });
    loadFilmsFile();
    loadSeatsFile();
    getDataFilm();

    $(".form-imput").focus(function() {
        $(this).parent().addClass("is-active is-completed");
    });

    $(".form-imput").focusout(function() {
        if ($(this).val() === "")
            $(this).parent().removeClass("is-completed");
        $(this).parent().removeClass("is-active");
    })

    var priceTicket = 8.75;
    $("#totalPrice .price").text("Precio: " + priceTicket + " €");

    if (seatIDs.length == 0)
        $("#totalPrice ul").hide();

    $(".seat").on("click", function() {
        seatID = $(this).attr('id');
        var clase = $(this).attr('class');
        if (clase == "seat libre") {
            price = price + priceTicket;
            ticketCounter++;
            document.getElementById(seatID).setAttribute("class", "seat reservado");
            seatIDs.push(seatID)
                // console.log("Has seleccionado: " + seatID);
        }
        if (clase == "seat reservado") {
            price = price - priceTicket;
            ticketCounter--;
            document.getElementById(seatID).setAttribute("class", "seat libre");
            // console.log("Has deseleccionado: " + seatID);

            var i = seatIDs.indexOf(seatID);
            if (i !== -1) {
                seatIDs.splice(i, 1);
            }
        }
        if (seatIDs.length != 0) {
            $("#totalPrice ul").show();
        }

        $("#totalPrice ul li").remove();
        for (var i in seatIDs) {
            $("#totalPrice ul").append("<li>" + seatIDs[i] + "</li>");
        }

        $("#totalPrice .subtotal").text("Subtotal: " + price.toFixed(2) + " €");
        $("#totalPrice .ticketsCount").text("Entradas: " + ticketCounter);
    });

    $(".b_back").on("click", function() {
        var activeTab = $("#tabs").tabs("option", "active");
        $("#tabs").tabs({ active: activeTab - 1 });
    })

    $(".b_next").on("click", function() {
        if ($(".reservado").length == 0) {
            alert("No ha seleccionado ningún asiento.");
        } else {
            $(".spinner").show();
            $(".seats").hide();

            var activeTab = $("#tabs").tabs("option", "active");
            window.setTimeout(function() {
                $(".spinner").hide();
                $(".seats").show();
                $("#tabs").tabs({ active: activeTab + 1 });
            }, 3000);
        }
    })

    $(".b_confirm").on("click", function() {
        if ($(".reservado").length == 0) {
            alert("No ha seleccionado ningún asiento.");
        } else {
            for (var i = 0; i < seatIDs.length; i++) {
                sessionData[2][seatIDs[i]].estado = "ocupado";
            }
            localStorage.setItem(sessionID, JSON.stringify(sessionData));

            // Cambiamos el color de la butaca solo en memoria
            for (var i = 0; i <= seatIDs.length - 1; i++) {
                document.getElementById(seatIDs[i]).setAttribute("class", "butaca ocupado");
            }

            $(".spinner").show();
            $(".purchase").hide();

            window.setTimeout(function() {
                $(".spinner").hide();
                $(".purchase").show();
                $("#tabs").tabs({
                    active: 2,
                    disabled: [0, 1]
                });
                savePurchase();
            }, 3000);
        }
    })

    // $("form").on("submit", function() {
    //     if ($(".reservado").length == 0) {
    //         alert("No ha seleccionado ningún asiento.");
    //     } else {
    //         for (var i = 0; i < seatIDs.length; i++) {
    //             sessionData[2][seatIDs[i]].estado = "ocupado";
    //         }
    //         localStorage.setItem(sessionID, JSON.stringify(sessionData));

    //         // Cambiamos el color de la butaca solo en memoria
    //         for (var i = 0; i <= seatIDs.length - 1; i++) {
    //             document.getElementById(seatIDs[i]).setAttribute("class", "butaca ocupado");
    //         }

    //         $(".spinner").show();
    //         $(".purchase").hide();

    //         window.setTimeout(function() {
    //             $(".spinner").hide();
    //             $(".purchase").show();
    //             $("#tabs").tabs({
    //                 active: 2
    //             });
    //             savePurchase();
    //         }, 3000);
    //     }
    // })
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

// Conectar y recibir los datos del JSON de seats
function loadSeatsFile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var file = xhttp.responseText;
        seats = JSON.parse(file);
    };
    xhttp.open("GET", "assets/js/custom/seats.json", false);
    xhttp.send();
}

function getDataFilm() {
    var filmData = [];
    var filmID = localStorage.getItem("filmID");
    for (var i in films) {
        if (i == filmID) {
            filmData.push(films[i]);
        }
    }
    sessionID = localStorage.getItem('sessionID');
    sessionData = JSON.parse(localStorage.getItem(sessionID));

    insertInfomation(filmData);
}

// Insertar la información en la página
function insertInfomation(filmData) {
    $(document).prop("title", "DG Cines | " + filmData[0].titulo);

    $("#titleFilm .emphasis").text(filmData[0].titulo);
    $("#premiereFilm .emphasis").text(filmData[0].estreno);
    $("#kindFilm .emphasis").text(filmData[0].genero);
    $("#cover").attr({ "src": filmData[0].caratula, "alt": "Carátula de " + filmData[0].titulo, "title": filmData[0].titulo });
    var currentDate = new Date();
    $("#dateSession .emphasis").text(currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear());
    $("#showSession .emphasis").text(sessionData[0] + "h.");
    $("#b_trailer").attr("href", filmData[0].trailer);

    var items = JSON.parse(localStorage.getItem(sessionID))[2];
    for (var i in items) {
        document.getElementById("design").innerHTML += "<use id='" + i + "' xlink:href='#seat' title='" + i + "' class='seat " + items[i].estado + "' x='" + items[i].x + "' y='" + items[i].y + "' width='100' height='100' />";
    }
}


// Guardar la compra en el localStorage
function savePurchase() {
    var purchaseCounter = localStorage.getItem("purchase");
    if (purchaseCounter == null) {
        purchaseCounter = 1;
    } else {
        purchaseCounter++;
    }

    localStorage.setItem("purchase", purchaseCounter);

    var purchaseData = [];
    purchaseData.push("Película: " + $("#titleFilm .emphasis").text());
    purchaseData.push("Nombre: " + $("#first-name").val());
    purchaseData.push("Apellidos: " + $("#last-name").val());
    purchaseData.push("Email: " + $("#address").val());
    purchaseData.push($("#totalPrice .subtotal").text());
    purchaseData.push("Asientos: " + seatIDs);

    localStorage.setItem("purchase_" + purchaseCounter, JSON.stringify(purchaseData));
}