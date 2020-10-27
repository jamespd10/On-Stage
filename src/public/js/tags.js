/*para buscar por nombre o cédula*/
$(document).ready(function () {
  $("#input-card-tags").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#row-card-tags #col-card-tags").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});