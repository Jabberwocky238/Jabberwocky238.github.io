
$(document).ready(function(){
        //开关抽屉
        $(".drawer").click(()=>{
            $("nav").toggle("fast")
        });
        //开关更多
        $(".more-button").on("click",()=>{
            $(".more-list").toggle("fast")
        });
        //AJAX part

        $.getJSON('music.json',(json)=>{
            var jsonobj = json;
            var musicinfo = jsonobj.musicinfo;
            musicinfo.forEach(element => {
                const song = element.song;
                const detail = element.detail;

                const pic = "album-pic/";
                const mus = "musics/";
                
                var navchild = "<div id='" + song + "'>"+ song +"</div>";
                $("nav").append(navchild);

                $("#"+song).click(()=>{
                    
                    $(".info").text(song);

                    $(".main img").attr("src",pic + song + ".jpg");
                    $(".main .detail").text(detail);
                    $(".main audio source").attr("src",mus + song + ".mp3");
                    $(".main audio source").attr("type","audio/mpeg");
                    // src="musics/Let You Down.mp3" type="audio/mpeg"
                    // $(".main a").attr()
                })
            });
        })
})