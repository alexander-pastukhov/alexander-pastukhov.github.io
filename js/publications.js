$(".abstract-btn").click(function(){
    if ($("#card-"+$(this).attr("doi")).attr("hidden")) {
        $("#card-"+$(this).attr("doi")).attr("hidden", false);
        $(this).text("Abstract ↑");
    }
    else {
        $("#card-"+$(this).attr("doi")).attr("hidden", true);
        $(this).text("Abstract ↓");
    }    
});