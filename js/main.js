var instance = null;

vex.dialog.isEnabled = false;
function showScreen(width, height) {
    if (vex.dialog.isEnabled) {
        //
    }
    else {
        var videoHtml = '<div class="screen"></div>';
        vex.dialog.buttons.NO.text = 'Close';
        vex.dialog.buttons.YES.text = 'Folding';
        vex.dialog.open({
            message: 'Image',
            input: videoHtml,
            callback: function (data) {
                vex.dialog.isEnabled = false;
            }
        });
        vex.dialog.isEnabled = true;
    }
    $('.screen').width(width);
    $('.screen').height(height);
}


$('figure').click(function (e) {
    instance = e.target;
    var node = instance.getAttribute('src').split('.')[0];

    var fatherDiv = $('img[src$="' + instance.getAttribute('src') + '"]').parent();
    vex.dialog.open({
        message: 'Let\'s Hit It !',
        input: "<input name=\"danmu\" type=\"text\" placeholder=\"弹幕\" required />\n",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'Hit !'
            })
        ],
        callback: function (data) {
            var ref = new Wilddog("https://photohit.wilddogio.com/" + node + "/" + new Date().getTime());
            ref.set({
                'user': 'guest',
                'comment': data.danmu
            })
            HitPhoto(fatherDiv, [data.danmu]);
            return console.log(data.danmu);
        }
    });
});


$('img').mouseover(function (e) {
    if (window.isEnable) {
        return false;
    }
    window.isEnable = true;
    instance = e.target;
    var node = instance.getAttribute('src').split('.')[0];
    var fatherDiv = $('img[src$="' + instance.getAttribute('src') + '"]').parent();
    var ref = new Wilddog("https://photohit.wilddogio.com/");
    ref.child(node).orderByKey().once("value", function (datasnapshot) {
        var list = datasnapshot.val();
        var comments = []
        for (var i in list) {
            comments.push(list[i]['comment']);
        }
        HitPhoto(fatherDiv, comments);
    });

});

$('img').mouseleave(function (e) {
    if (window.isEnable == false) {
        return false;
    }
    window.isEnable = false;

    instance = e.target;
    var fatherDiv = $('img[src$="' + instance.getAttribute('src') + '"]').parent();
    // fatherDiv.attr('id', '');
    clearInterval(window.inter);
});

function getDoc(fn) {
    return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
}


function upload() {
    var htmlContent = getDoc(function () {/*
<div id="container">
<a href="#" id="pickfiles">选择文件</a>
</div>*/
    });

    vex.dialog.open({
        message: 'Upload Image',
        input: '<div id="container"><a href="#" id="pickfiles">选择文件</a></div>',
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'Hit !'
            })
        ],
        callback: function (data) {
            // Variable to store your files
            var file = $('input[type=file]')[0].files[0];
            console.log(file);
        }
    });
    initQiniu();

}
