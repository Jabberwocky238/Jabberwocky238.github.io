
$(document).ready(function(){
    $(".drawer").click(()=>{
        $("nav").toggle("fast")
    });
    $.getJSON("./context.json",function(json){
        const jsonobj = json;
        const articles = jsonobj.articles;
        articles.forEach(element => {
            $("nav").append("<div id='context" + element.number + "'>"+ element.title +"</div>");
            $("#context" + element.number).click(()=>{
                $(".title").text(element.title)

                if(Array.isArray(element.context)){
                    var str = "";
                    element.context.forEach(passage =>{
                        str = str.concat(str,passage,"<br>")
                    })
                    $(".context").html(str)
                }
                else{
                    $(".context").text(element.context)
                }
                
            })
        });
    })


    // $("article").load("contexts/1.txt")

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = ()=>{
    //     const text = xhttp.responseText;
    //     $("article").text(text);
    // }
    // xhttp.open("GET","./contexts/1.txt",true);
    // xhttp.send();

})
