//http://randomdance.party/hps_grave.html get logos
var logos = [
    'rdp_disco.gif',
    'rdp_disco.png',
    'rdp_disco_split.gif',
    'rdp_gangnam.png',
    'rdp_gotta_go_dance.png',
    'rdp_high_roll.gif',
    'rdp_matrix.png',
    'rdp_neon.png',
    'rdp_new_style.png',
    'rdp_paper.png',
    'rdp_random_fast.gif',
    'rdp_ripple.png',
    'rdp_split_colors.gif',
    'rdp_thermal.png',
    'rdp_tiles.png',
    'rdp_vertical_mirrors.png'
];

var player;
var videoList = [];

$(document).ready(function() {
    if (document.cookie.split(';').filter(function(item) { item.includes('monochromeMode=1')}).length || /#monochrome/i.test(window.location.hash)) {
        $('body').addClass('monochrome');
    }
    
    if (Math.random() > 0.8) {
        document.getElementById('logo').style.backgroundImage = 'url("/logos/'+logos[Math.floor(Math.random() * logos.length)]+'")';
    }
});

function toggleMonochrome() {
    $('body').toggleClass("monochrome");
    if(!!$('body.monochrome').length) {
        document.cookie = "monochromeMode=1; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    } else {
        document.cookie = "monochromeMode=0";
    }
}

function loadVideos(VideoListLoc) {
    $.getJSON(VideoListLoc, function(data) { processData(data) });
    //$.get('/RDPList.csv', function(data) { processData(data) }); //Tested serving a smaller CSV file instead - 34KB vs 325KB. No noticable difference in page load/processing times or page size. The differences are too small, and YT iFrame too dominant on the page.
    if(window.location.search) {
        $("#leftNav .navItem[name='"+window.location.search.match(/Year=(.*)(&|$)/)[1]+"']").addClass("active");;
    } else {
        $("#leftNav .navItem[name='All']").addClass("active");
    }
}

function processData(rdpData) {
    rdpData.forEach(function(rdpEntry) {
        if(window.location.search) {
            if(rdpEntry.Year == window.location.search.match(/Year=(.*)(&|$)/)[1]) {
                videoList.push(rdpEntry.VideoId)
            }
        } else {
            videoList.push(rdpEntry.VideoId);
        }
    });

    generatePlayer()
}

function getRDP() {
    return videoList[Math.floor(Math.random() * videoList.length)];
}

function generatePlayer() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '720',
      width: '1280',
      videoId: getRDP(),
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
}

function onPlayerReady(event) {
    //event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.cueVideoById(getRDP());
    } else if (event.data == YT.PlayerState.CUED) {
        event.target.playVideo();
    }
}