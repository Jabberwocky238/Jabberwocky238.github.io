

$(document).ready(function(){
        //开关抽屉
        $(".drawer").click(()=>{
            $("nav").toggle();
            $("audio").toggle();
        });
        //开关更多
        $(".more-button").on("click",()=>{
            $(".more-list").toggle("fast")
        });
        //AJAX part

        // $.getJSON('music.json',(json)=>{
        //     var jsonobj = json;
        //     var musicinfo = jsonobj.musicinfo;
        //     musicinfo.forEach(element => {
        //         const song = element.song;
        //         const detail = element.detail;

        //         const pic = "album-pic/";
        //         const mus = "musics/";

        //         var navchild = "<div id='" + song + "'>"+ song +"</div>";
        //         $("nav").append(navchild);

        //         $("#"+song).click(()=>{
                    
        //             $(".info").text(song);

        //             $(".main img").attr("src",pic + song + ".jpg");
        //             $(".main .detail").text(detail);
        //             $(".main audio source").attr("src",mus + song + ".mp3");
        //             $(".main audio source").attr("type","audio/mpeg");
        //             // src="musics/Let You Down.mp3" type="audio/mpeg"
        //             // $(".main a").attr()
        //         })
        //     });
        // })

        $.ajax({
            url:"music.json",
            type:'get',
            cache:false,
            async:true,
            dataType:"json",
            timeout:"30000",
            contentType:"X-Content-Type-Options:nosniff",

            success: (json)=>{
                var jsonobj = json;
                var musicinfo = jsonobj.musicinfo;
                musicinfo.forEach(element => {
                    const song = element.song;
                    const detail = element.detail;
    
                    const pic = "https://jabberwocky238.github.io/music/album-pic/";
                    const mus = "https://jabberwocky238.github.io/music/musics/";
    
                    var navchild = "<div id='" + song + "'>"+ song +"</div>";
                    $("nav").append(navchild);

                    $("#"+song).click(()=>{
                        var songname = song.replace("-"," ");
                        $(".info").text(songname);
                        $("#detail").text(detail);
                        $("nav").css("display","none");
                        // $("#source").attr("src",mus+song+".mp3");

                        $("audio").remove();
                        var source = '<source id="source" src="' + mus + song + '.mp3" type="audio/mpeg">'
                        var audio = '<audio controls="controls"></audio>'
                        $("#detail").after(audio);
                        $("audio").append(source);

                        $("#image").attr("src",pic + song + ".jpg");
                        $("#download").attr("src",mus + song + ".mp3");
                        $("#download").attr("download",song + ".mp3");
                        // var xhr1 = new XMLHttpRequest();
                        // xhr1.open('GET',pic+song+".jpg",true);
                        // xhr1.responseType = 'blob';
                        // xhr1.onload = (res) =>{
                        //     var reader = new FileReader();
                        //     reader.readAsDataURL(res);
                        //     reader.onload = (element) => {
                        //         $("#image").attr("src",element.target.result);
                        //     }
                        // }
                        // xhr1.send();


                        // $.get(mus+song+".mp3",(data)=>{
                        //     var reader = new FileReader();
                        //     reader.readAsDataURL(data);
                        //     reader.onload = (element)=>{
                        //         $("#source").attr("src",element.target.result);
                        //     }
                        // });
                        // $.get(pic+song+".jpg",(data)=>{
                        //     var reader = new FileReader();
                        //     reader.readAsDataURL(data);
                        //     reader.onload = (element)=>{
                        //         $("#image").attr("src",element.target.result);
                        //     }
                        // });

                    })
                });
            }
        })
})