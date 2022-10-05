

$(document).ready(function(){
    $(".drawer").click(()=>{
        $("nav").toggle("fast")
    });
    $("article").load("contexts/1.txt")

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = ()=>{
    //     const text = xhttp.responseText;
    //     $("article").text(text);
    // }
    // xhttp.open("GET","./contexts/1.txt",true);
    // xhttp.send();

    var file = new FileReader();
    file.readAsText("./contexts/1.txt");
    alert(file.result);
})
