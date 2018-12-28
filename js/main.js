"use strict"

function getElement(selector) {
    return document.querySelector(selector);
}
var main = getElement('.make-center');

//document.getElementById('open-room').onclick = function() {
main.querySelector('#open-room').onclick = function() {
    var roomInfo = this.parentNode.querySelector('#room-id');
    if (!roomInfo.value || !roomInfo.value.length) 
    {
        roomInfo.focus();
        return alert('Your MUST Enter Room id!');
    }
    connection.channel = roomInfo.value;
    connection.checkPresence(roomInfo.value, function(isRoomExists){
        if (isRoomExists){
            enableInputButtons();
            roomInfo.focus();
            return alert('Room id already found!');
        //connection.join(roomInfo.value);
        } else {
           connection.open(roomInfo.value, function(){
                showRoomURL(connection.sessionid);
            });
        }
        });
        disableInputButtons();
};

main.querySelector('#join-room').onclick = function() {
    var roomInfo = this.parentNode.querySelector('#room-id');
    console.log(roomInfo.value);
    if (!roomInfo.value || !roomInfo.value.length) 
    {
        roomInfo.focus();
        return alert('Your MUST Enter Room id!');
    }
    disableInputButtons();
    connection.join(roomInfo.value);
    //document.querySelector('#start-recording').disabled = false;
};

main.querySelector('#open-or-join-room').onclick = function() {
    var roomInfo = this.parentNode.querySelector('#room-id');
    if (!roomInfo.value || !roomInfo.value.length) 
    {
        roomInfo.focus();
        return alert('Your MUST Enter Room id!');
    }
    connection.openOrJoin(roomInfo.value, function(isRoomExists, roomid) {
        if(!isRoomExists) {
            showRoomURL(roomid);
            //document.querySelector('#start-recording').disabled = false;
        }
    });
    disableInputButtons();
};

document.getElementById('btn-leave-room').onclick = function() {
    this.disabled = true;
    if(connection.isInitiator) {
        // use this method if you did NOT set "autoCloseEntireSession===true"
        connection.closeEntireSession(function() {
            document.querySelector('h1').innerHTML = 'Entire session has been closed.';
        });
    }
    else {
        connection.leave();
    }
};

// ......................................................
// ................FileSharing/TextChat Code.............
// ......................................................

document.getElementById('share-file').onclick = function() {
    var fileSelector = new FileSelector();
    fileSelector.selectSingleFile(function(file) {
        connection.send(file);
    });
};

document.getElementById('input-text-chat').onkeyup = function(e) {
    if (e.keyCode != 13) return;

    // removing trailing/leading whitespace
    this.value = this.value.replace(/^\s+|\s+$/g, '');
    if (!this.value.length) return;

    connection.send(this.value);
    appendDIV(this.value);
    this.value = '';
};

var chatContainer = document.querySelector('.chat-output');

function appendDIV(event) {
    var div = document.createElement('div');
    div.innerHTML = event.data || event;
    chatContainer.insertBefore(div, chatContainer.firstChild);
    div.tabIndex = 0;
    div.focus();

    document.getElementById('input-text-chat').focus();
}

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = '/';

// comment-out below line if you do not have your own socket.io server

connection.socketMessageEvent = 'audio-video-file-chat';

connection.enableFileSharing = true; // by default, it is "false".

connection.session = {
    audio: true,
    video: true,
    data: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.videosContainer = document.getElementById('videos-container');
var videoDiv = document.getElementById('video-url');

var blobs = [];
var recorder;
var streamArray=[];
connection.onstream = function(event) {
    console.log(event);
    var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
    var mediaElement = getMediaElement(event.mediaElement, {
        title: event.userid,
        buttons: ['full-screen'],
        //buttons: ['record-audio','mute-audio', 'mute-video', 'full-screen', 'volume-slider', 'stop','take-snapshot'],
        width: width,
        showOnMouseEnter: true
    });
    //console.log("onstream");
    streamArray.push(event.stream);
    connection.videosContainer.appendChild(mediaElement);
    // if(!multiStreamRecorder || !multiStreamRecorder.stream)
    // { 
    //     console.log("multiStreamRecorder not available1");
    // }
    // else
    // {
    //     multiStreamRecorder.addStream(event.stream);
    // }
    mediaElement.media.setAttribute('autoplay', 'autoplay')
    mediaElement.media.setAttribute('playsinline', true)
    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;
    var streamId = event.streamid
};
connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if(mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

connection.onmessage = appendDIV;
connection.filesContainer = document.getElementById('file-container');

connection.onopen = function() {
    document.getElementById('share-file').disabled = false;
    document.getElementById('input-text-chat').disabled = false;
    document.getElementById('btn-leave-room').disabled = false;
    if(document.getElementById('start-recording').disabled==true)
    {
        document.getElementById('start-recording').disabled = false;
    }
    console.log(connection.getAllParticipants());
    document.querySelector('h1').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
};

connection.onclose = function() {
    if(connection.getAllParticipants().length) {
        document.querySelector('h1').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
    }
    else {
        document.querySelector('h1').innerHTML = 'session has been closed or all participants left.';
    }
};

connection.onEntireSessionClosed = function(event) {
    document.getElementById('share-file').disabled = true;
    document.getElementById('input-text-chat').disabled = true;
    document.getElementById('btn-leave-room').disabled = true;

    document.getElementById('open-or-join-room').disabled = false;
    document.getElementById('open-room').disabled = false;
    document.getElementById('join-room').disabled = false;
    document.getElementById('room-id').disabled = false;

    connection.attachStreams.forEach(function(stream) {
        stream.stop();
    });

    // don't display alert for moderator
    if(connection.userid === event.userid) return;
    document.querySelector('h1').innerHTML = 'Entire session has been closed: ' + event.userid;
};

connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
    // seems room is already opened
    connection.join(useridAlreadyTaken);
};

function disableInputButtons() {
    document.getElementById('open-or-join-room').disabled = true;
    document.getElementById('open-room').disabled = true;
    document.getElementById('join-room').disabled = true;
    document.getElementById('room-id').disabled = true;
}
function enableInputButtons() {
    document.getElementById('open-or-join-room').disabled = false;
    document.getElementById('open-room').disabled = false;
    document.getElementById('join-room').disabled =false;
    document.getElementById('room-id').disabled = false;
}
// ......................................................
// ......................Handling Room-ID................
// ......................................................

function showRoomURL(roomid) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;

    // var html = '<h2>Unique URL for your room:</h2><br>';
    var html = '';

    html += 'Request Room id : <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
    html += '<br>';
    //html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';

    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;

    roomURLsDiv.style.display = 'block';
}

(function() {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    window.params = params;
})();

var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
    roomid = localStorage.getItem(connection.socketMessageEvent);
} else {
    roomid = connection.token();
}
document.getElementById('room-id').value = roomid;
document.getElementById('room-id').onkeyup = function() {
    localStorage.setItem(connection.socketMessageEvent, this.value);
};

var hashString = location.hash.replace('#', '');
if(hashString.length && hashString.indexOf('comment-') == 0) {
  hashString = '';
}

var roomid = params.roomid;
if(!roomid && hashString.length) {
    roomid = hashString;
}

if(roomid && roomid.length) {
    document.getElementById('room-id').value = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);
    console.log("reCheckRoomPresence");
    // auto-join-room
    (function reCheckRoomPresence() {
        connection.checkPresence(roomid, function(isRoomExists) {
            if(isRoomExists) {
                connection.join(roomid);
                //console.log(connection);
                //recorder.addStream
                // if(!multiStreamRecorder || !multiStreamRecorder.stream)
                // { 
                //     //multiStreamRecorder.addStream(multiStreamRecorder.stream);
                //     console.log("multiStreamRecorder not available");
                // }
                // else
                // {
                //     multiStreamRecorder.addStream(multiStreamRecorder.stream);
                // }
                // if(!multiStreamRecorder)
                // {
                //     //multiStreamRecorder.addStream(connection.stream);
                //     console.log("multiStreamRecorder available reCheckRoomPresence");
                // }
                // else
                // {
                //     console.log("multiStreamRecorder not available reCheckRoomPresence");
                // }
                // return;
            }
             //console.log(connection);
            setTimeout(reCheckRoomPresence, 5000);
        });
    })();

    disableInputButtons();
}
function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

var mediaConstraints = {
    audio: true,
    video: true
};

document.querySelector('#start-recording').onclick = function() {
    this.disabled = true;
    console.log(multiStreamRecorder);
    if(multiStreamRecorder==undefined)
    {
        captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    }
    if(multiStreamRecorder!=undefined)
    {
        multiStreamRecorder.stop();
        captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
        document.querySelector('#stop-recording').disabled = false;
        //document.querySelector('#pause-recording').disabled = false;
    }
};

document.querySelector('#stop-recording').onclick = function() {
    this.disabled = true;
    multiStreamRecorder.stop();
    multiStreamRecorder.stream.stop();

    //document.querySelector('#pause-recording').disabled = true;
    document.querySelector('#start-recording').disabled = false;
};

/*
document.querySelector('#pause-recording').onclick = function() {
    this.disabled = true;
    multiStreamRecorder.pause();
    document.querySelector('#resume-recording').disabled = false;
};


document.querySelector('#resume-recording').onclick = function() {
    this.disabled = true;
    multiStreamRecorder.resume();
    //document.querySelector('#pause-recording').disabled = false;
};
*/

//multiStreamRecorder
var multiStreamRecorder;
var index = 1;
function onMediaSuccess(stream) {
    console.log('loadedmetadata');
    if(multiStreamRecorder && multiStreamRecorder.stream)
    {
        console.log('Existing player');
        multiStreamRecorder.stop();
        multiStreamRecorder = new MultiStreamRecorder([stream]);
        multiStreamRecorder.mimeType = 'video/mp4';
        multiStreamRecorder.stream = stream;
        if(streamArray.length>1)
        {
            console.log('New media player with multiple stream');
            multiStreamRecorder = new MultiStreamRecorder(streamArray);
        }
    }
    else
    {
        if(streamArray.length>1)
        {
            console.log('New media player with multiple stream');
            multiStreamRecorder = new MultiStreamRecorder(streamArray);
        }
        else
        {
            console.log('New media player with single stream');
            multiStreamRecorder = new MultiStreamRecorder([stream]);

        }
        multiStreamRecorder.mimeType = 'video/mp4';
        multiStreamRecorder.stream = stream;
    }            
    
    // multiStreamRecorder.previewStream = function(stream) {
    // 	connection.videosContainer.src = URL.createObjectURL(stream);
    // 	connection.videosContainer.play();
    // };

    multiStreamRecorder.ondataavailable = function(blob) {
        appendLink(blob);
    };

    function appendLink(blob) {
        
        var recordedVideoUrl = document.URL.replace('index','video');
        // console.log(recordedVideoUrl);
        // var recordedVideoDiv = recordedVideoUrl.getElementById('recorded-video-stream');
        
        //var recordedVideoDiv = recordedDocument.getElementById('video-url');
        //var recordedDocument = recordedDocument.createElement('a');
        var a = document.createElement('a');
        var url = URL.createObjectURL(blob);
        window.open(url,'_blank')
        a.target = '_blank';
        a.innerHTML = 'Your video is Here ' + (blob.type == 'audio/ogg' ? 'Audio' : 'Video') + ' No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ')';                  
        // Time Length: ' + getTimeLength(timeInterval);
        a.href = URL.createObjectURL(blob);
        console.log(recordedVideoUrl);
        blobUtil.blobToBase64String(blob).then(function (base64String) {
        console.log(base64String);
        }).catch(function (err) {
        console.log();
        });
        videoDiv.appendChild(a);
        videoDiv.appendChild(document.createElement('hr'));


        //  recordedDocument.target = '_blank';
        //  recordedDocument.innerHTML = 'Your video is Here ' + (blob.type == 'audio/ogg' ? 'Audio' : 'Video') + ' No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ')';
        //  recordedDocument.href = URL.createObjectURL(blob);
        //  recordedVideoDiv.appendChild(a);
        //  recordedVideoDiv.appendChild(document.createElement('hr'));
    }

    var timeInterval = 0;
    // get blob after specific time interval
    multiStreamRecorder.start(timeInterval);

    // document.querySelector('#add-stream').onclick = function() {
    // 	if(!multiStreamRecorder || !multiStreamRecorder.stream) return;
    // 	multiStreamRecorder.addStream(multiStreamRecorder.stream);
    // };

    document.querySelector('#stop-recording').disabled = false;
    //document.querySelector('#pause-recording').disabled = false;
}

function onMediaError(e) {
    console.error('media error', e);
}           

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
    var data = new Date(milliseconds);
    return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
}