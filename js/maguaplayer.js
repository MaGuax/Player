////辅助函数
//找出旧下标
var oldindex = (name, list) => {
    for(var i = 0; i < list.length; i++) {
        var theName = list[i]
        if(name == theName) {
            return i
        }
    }
}

//歌曲路径加载成功时播放
var ok = () => {
    var a = e("#id-audio-player")
    bindEvent(a, 'canplay', function() {
        var control = e('#id-button-control')
        addClass(control, 'play')
        a.play()
    })
}

var changeCss = (selector, key, value) => {
      selector.style[key] = value
}

////按钮的各个功能：
// 歌曲列表
var songs = ['1.mp3', '2.mp3', '3.mp3']

// 上下按钮点击切歌时的辅助函数：根据点击返回的歌曲路径
var changeSong = (path, list, offset) => {
    //求出新歌曲的路径
    var name = path.split('/')[1]
    var number = list.length
    var nowIndex = oldindex(name, list)
    var newIndex = (number + nowIndex + offset) % number
    return list[newIndex]
}

// 上一首按钮
var up = () => {
    var s = e("#id-button-last")
    var control = e("#id-button-control")
    bindEvent(s, 'click', function() {
        toggleClass(control, 'play')
        var a = e('#id-audio-player')
        var nowPath = a.dataset.path
        var nextPath = "mp3/" + changeSong(nowPath, songs, -1)
        a.src = nextPath
        a.dataset.path= nextPath
        a.play()
    })
}

// 下一首按钮
var down = () => {
    var s = e("#id-button-next")
    var control = e("#id-button-control")
    bindEvent(s, 'click', function() {
        toggleClass(control, 'play')
        var a = e('#id-audio-player')
        var nowPath = a.dataset.path
        var nextPath = "mp3/" + changeSong(nowPath, songs, 1)
        a.src = nextPath
        a.dataset.path= nextPath
        a.play()
    })
}

// 控制按钮的样式
var playStyel = () => {
    //播放时的样式
    var s = e("#id-button-control")
    var a = e('#id-audio-player')
    bindEvent(a, 'play', function() {
        s.innerHTML = '||'
    })
}
var pauseStyle = () => {
    //暂停时的样式
    var s = e("#id-button-control")
    var a = e('#id-audio-player')
    bindEvent(a, 'pause', function() {
        s.innerHTML = '►'
    })
}
var style = () => {
    playStyel()
    pauseStyle()
}
// 控制点击播放或暂停
var click = function() {
    var s = e("#id-button-control")
    var a = e('#id-audio-player')
    bindEvent(s, 'click', function() {
        toggleClass(s, 'play')
        if(s.classList.contains("play")) {
            a.play()
        }else {
            a.pause()
        }
    })
}
// 控制按钮
var control = () => {
    style()
    click()
}

//播放循序列表
var stateList = ["inturn", "randomPlay", "one"]

//单曲
var one = function() {
    log('one')
    var a = e("#id-audio-player")
    a.play()
}

//循序
var ranking = 0
var nextSong = function() {
    ranking = (ranking + 1) % songs.length
    return songs[ranking]
}
var inturn = function() {
    var a = e('#id-audio-player')
    var song = 'mp3/' + nextSong()
    a.src = song
    log('inturnsong', song)
    //a.play()
}

//随机
var random01 = function() {
    var n = Math.random()
    var r = 9
    if (0 < n && n  < 0.3) {
        r = 0
    } else if(0.3 < n && n < 0.6){
        r = 1
    } else if(0.6 < n && n < 0.9){
        r = 2
    }
    return r
}
var randomSong = function() {
    r_index = random01()
    var song = 'mp3/' + songs[r_index]
    return song
}
var randomPlay = function() {
    var a = e('#id-audio-player')
    var song = randomSong()
    a.src = song
    log('randomsong', song)
    //a.play()
}

//新播放循序下标
var changeState = (old, list) => {
    var number = list.length
    var name = list[old]
    var nowIndex = oldindex(name, list)
    var newIndex = (number + nowIndex + 1) % number
    return newIndex
}
//改变播放循序
var stateOder = () => {
    var s = e("#id-button-oder")
    var oldState = s.dataset.state
    var newState = changeState(oldState, stateList)
    s.dataset.state = newState
    if (newState == '0') {
        s.innerHTML = '循环'
    }else if (newState == '1') {
        s.innerHTML = '随机'
    }else if (newState == '2'){
        s.innerHTML = '单曲'
    }
}

//根据播放模式决定下一首歌
var oderChioce = (key) => {
    var s = e('#id-button-oder')
    if (key == '0') {
        inturn()
    }else if (key == '1') {
        randomPlay()
    }else if (key == '2'){
        one()
    }
}
//点击切换播放模式按钮
var oderChlick = () => {
    var s = e("#id-button-oder")
    bindEvent(s, "click", function() {
        stateOder()
    })
}

//// 结束时根据播放模式继续播放
var oderPlay = () => {
    var a = e('#id-audio-player')
    bindEvent(a, 'ended', function() {
        var s = e('#id-button-oder')
        var control = e('#id-button-control')
        var oderIndex = s.dataset.state
        oderChioce(oderIndex)
        ok()
    })

}


////点击歌曲列表切换歌曲
var changeMusic = function() {
    var selector = es('.music')
    var a = e('#id-audio-player')
    bindAll(selector, 'click', function(event) {
        var song = event.target
        var nextsong = song.dataset.path
        a.dataset.path = nextsong
        a.src = nextsong
        ok()
    })
}

////进度条
var bar = () => {
    var a = e('#id-audio-player')
    var nowBar = e('#id-span-now')
    bindEvent(a, 'timeupdate', function() {
        var allLength = a.duration
        var nowLength = a.currentTime
        var width = ((nowLength / allLength) * 100) * 3.6
        var nowWidth = `${width}` + 'px'
        changeCss(nowBar, 'width', nowWidth)
    })
}

//音量控制
var voice = () => {
    var v = e('#id-input-voice')
    var a = e('#id-audio-player')
    a.volume = Number(v.value * 0.01)
    bindEvent(v, 'change', function() {
        var value = (v.value) * 0.01
        log(value)
        a.volume = Number(value)
    })
}

var __main = () => {
    up()
    down()
    control()
    oderChlick()
    oderPlay()
    changeMusic()
    bar()
    //voice()
}

__main()
