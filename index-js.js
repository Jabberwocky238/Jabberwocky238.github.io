
$(document).ready(function(){
    //开关抽屉
    $(".drawer").click(()=>{
        $("nav").toggle("fast")
    });
    //开关更多
    $(".more-button").click(()=>{
        $(".more-list").toggle("fast")
    });
    //AJAX part

    //获取名言名句
    
    // $.getJSON("./context.json",function(json){
    //     const jsonobj = json;
    //     const articles = jsonobj.articles;
    //     articles.forEach(element => {
    //         //加载正文标题
    //         $("nav").append("<div id='context" + element.number + "'>"+ element.title +"</div>");
    //         //加载正文内容
    //         $("#context" + element.number).click(()=>{
    //             $(".title").text(element.title)

    //             if(Array.isArray(element.context)){
    //                 var str = "";
    //                 element.context.forEach(passage =>{
    //                     str = str + passage + "<br>"
    //                 })
    //                 $(".context").html(str)
    //             }
    //             else{
    //                 $(".context").text(element.context)
    //             }
                
    //         })
    //     });
    // })

    $.ajax({
        url:"./context.json",
        type:'get',
        cache:false,
        async:true,
        dataType:"json",
        timeout:"30000",
        success: function(json){
            const jsonobj = json;
            const articles = jsonobj.articles;
            articles.forEach(element => {
                //加载正文标题
                $("nav").append("<div id='context" + element.number + "'>"+ element.title +"</div>");
                //加载正文内容
                $("#context" + element.number).click(()=>{
                    $(".title").text(element.title)
    
                    if(Array.isArray(element.context)){
                        var str = "";
                        element.context.forEach(passage =>{
                            str = str + passage + "<br>"
                        })
                        $(".context").html(str)
                    }
                    else{
                        $(".context").text(element.context)
                    }
                    
                });
            });
        }
    })
})
