function HitPhoto(stage, commentBox) {
    var playList = initPlayLists(commentBox);

    InitActor();
    config();
    setUp();

    function getRandomColor() {
        var c = '#';
        var cArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < 6; i++) {
            var cIndex = Math.round(Math.random() * 15);
            c += cArray[cIndex];
        }
        return c;
    }

    function initPlayList(time, text) {
        return {
            //从何时开始
            time: time,
            //经过的时间
            duration: 4500,
            //舞台偏移的高度
            top: Math.random() * 100,
            //弹幕文字大小
            size: 60,
            //弹幕颜色
            color: getRandomColor(),
            //内容
            text: text
        }
    }


    function initPlayLists(texts) {
        var playLists = []
        for (var i = 0; i < texts.length; ++i) {
            playLists.push(initPlayList(i * 100, texts[i]));
        }
        return playLists;
    }


    function setUp() {

        //这样我们就得到了一个支持事件机制的对象。
        var director = $({});
        //导演开始说戏过剧本
        //整理playList列表，组装事件
        $.each(playList, function (k, play) {
            //确定演员，确定场次
            var session = Math.ceil(play.time / window.CheckTime);
            play.session = session;
            //剧本拿给演员,召唤一个演员
            var actor = new Actor(play);
            //演员针对导演添加监听。
            //等导演说了这个场次后，就开始叫演员表演
            director.on(session + 'start', function () {
                actor.perform();
            })
        })

        var currentSession = 0;

        setInterval(function () {
            //第xx场开始表演
            director.trigger(currentSession + 'start');
            //从头再来一遍
            if (currentSession === window.PlayCount) {
                currentSession = 0;
            } else {
                currentSession++;
            }

        }, window.CheckTime);

        //准备舞台（这个上面其实已经说了）
        stage.css({
            position: 'relative',
            overflow: 'hidden'
        })

    }


    function config() {
        //弹幕的总时间（演出总时间）
        window.Time = 9000;
        //检测时间间隔（每一场的时间）
        window.CheckTime = 100;
        //总场数
        window.PlayCount = Math.ceil(window.Time / window.CheckTime);
    }

    //构造函数，传递一个剧本片段
    function Actor(play) {
        //保存剧本的副本
        this.play = play;
        //给自己化妆
        this.appearance = this.makeUp();
        //自己走上舞台旁边准备上场
        this.appearance.hide().appendTo(stage);
    }


    function InitActor() {
        //演员化妆，也就是最终呈现的样子
        Actor.prototype.makeUp = function () {
            var appearance = $('<div style="min-width:400px;font-size:' + this.play.size + ';color:' + this.play.color + ';">' + this.play.text + '</div>');
            return appearance;
        }

        //演员上场飘过
        Actor.prototype.animate = function () {
            var that = this;
            var appearance = that.appearance;
            var mywidth = appearance.width();
            //使用动画控制left
            appearance.animate({
                left: -mywidth
            }, that.play.duration, 'swing', function () {
                appearance.hide();
            });
        }

        //演员开始表演
        Actor.prototype.perform = function () {
            var that = this;
            var appearance = that.appearance;

            //准备入场,先隐藏在幕布后面
            appearance.css({
                position: 'absolute',
                left: stage.width() + 'px',
                top: that.play.top || 0,
                zIndex: 10,
                display: 'block'
            });
            //确定入场偏移时间，入场表演
            //导演只会说第几场开始了，可不会还帮你具体到某个时间点，所以需要你自己计算好入场的时间。
            var delayTime = that.play.time - (that.play.session - 1) * window.CheckTime;
            //演员需要修正自己上场的时间
            setTimeout(function () {
                that.animate();
            }, delayTime)
        }
    }


}
