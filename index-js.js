

$(document).ready(function(){
    $(".drawer").click(()=>{
        $("nav").toggle("fast")
    });
    $.getJSON("./context.json",function(json){
        const jsonobj = json;
        const articles = jsonobj.articles;
        articles.forEach(element => {
            $("nav").append("<a>"+ element.title +"</a>");
        });
    })
    $("article").load("contexts/1.txt")

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = ()=>{
    //     const text = xhttp.responseText;
    //     $("article").text(text);
    // }
    // xhttp.open("GET","./contexts/1.txt",true);
    // xhttp.send();

})
