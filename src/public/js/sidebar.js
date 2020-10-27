$(function () {

    $('[data-toggle="tooltip"]').tooltip();

    //PARA AGREGAR CLASE ACTIVE EN EL NAVBAR
    $('.right-item').removeClass('active');
    $('a[href="' + location.pathname + '"]').addClass('active');
    $('#dropdownMenuLink').click((e) => {
        if($("#dropdownMenuLink")[0].getAttribute("aria-expanded")==="false"){
            //$("#dropdownMenuLink").addClass("active");
            $("#dropdownMenuLink").toggleClass("active");
        }
        else{
            $("#dropdownMenuLink").removeClass("active");
        }
    });
    //FIN DE CLASE ACTIVE EN NAVBAR

    $('#btn-contraer').click((e) => {

        if ($("#btn-contraer")[0].getAttribute("data-original-title") == "Contraer") {

            $("#btn-contraer").attr("data-original-title", "Expandir");
            $("#btn-contraer i").attr("class", "far fa-arrow-alt-circle-right");
            //$("#redes-sociales")[0].style.marginLeft = "1px";
            //$(".redes-sociales").toggleClass("social-cel");

        }
        else {

            $("#btn-contraer").attr("data-original-title", "Contraer");
            $("#btn-contraer i").attr("class", "far fa-arrow-alt-circle-left");
            //$("#btn-contraer i").toggleClass("far fa-arrow-alt-circle-left");
            //$(".redes-sociales").toggleClass("social-toggled");

        }
        //alert("hola");
        if ($(window).width() < 768) {
            //$("#row-txt").toggleClass("justify-content-center");
            $(".col-bar").toggleClass("col-bar-cellPhone");
            $(".col-container").toggleClass("col-container-cellPhone");
            //$(".redes-sociales").toggleClass("social-cel");
        }
        else {
            $(".col-bar").toggleClass("col-bar-toggled");
            //$("#row-txt").toggleClass("justify-content-center");
            $(".col-container").toggleClass("col-container-toggled");
            $(".redes-sociales").toggleClass("social-toggled");

        }
        e.preventDefault();

    });
});