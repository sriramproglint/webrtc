

$(document).ready(function() {
    $('#stop-rec-btn').hide();
});

$(".video-chat").hide();
var mediaElementList = [];
var ownElement = undefined;

var isSafari = true;
var timeoutValue = 3000;
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('safari') != -1) {
    if (ua.indexOf('chrome') > -1) {
        isSafari = false;
    } else {
        isSafari = true;
        timeoutValue = 4000;
    }
}

//initialize the connections
var connection = new RTCMultiConnection();

connection.panel1 = `<div class="flex-view" id="container-1">
                        <div class="friend-face" id="video-container-opp">
                        </div>
                    </div>`;

connection.panel2 = `<div class="flex-view" id="container-1">
                        <div class="friend-face" id="video-container-opp">
                        </div>
                    </div>
                    <div class="flex-view flexColumn" id="container-2">
                        <div class="friend-face" id="video-container-opps-1">
                        </div>
                        <div class="friend-face" id="videos-container">
                        </div>
                    </div>`;
connection.panel3 = `<div class="flex-view" id="container-1">
                        <div class="friend-face" id="video-container-opp">
                        </div>
                    </div>
                    <div class="flex-view flexColumn" id="container-2">
                        <div class="friend-face" id="video-container-opps-2">
                        </div>
                        <div class="friend-face" id="video-container-opps-1">
                        </div>
                        <div class="friend-face" id="videos-container">
                        </div>
                    </div>`;
connection.panel = document.getElementById('panel');
connection.ourFace = document.getElementById('our-face');
connection.videosContainer = document.getElementById('videos-container');

connection.getAllParticipantsMediaElement = function() {
    return mediaElementList;
}
connection.pushMediaElement = function(userId, mediaElement, streamId, name) {
   var index= mediaElementList.findIndex(function(o){
        return o.userId == userId
    })
    if(index == -1){
        mediaElementList.push({
            userId: userId,
            element: mediaElement,
            streamId: streamId,
            name: name
        })
        connection.appendMediaElement()
    } else {
        mediaElementList[index] = {
            userId: userId,
            element: mediaElement,
            streamId: streamId,
            name: name
        }
      
        connection.appendMediaElement()
    }
}

connection.removeParticipantMediaElement = function(userId) {
    mediaElementList.forEach(function(media, index) {
        if (media.userId == userId) {
            mediaElementList.splice(index, 1)
        }
    })
    connection.appendMediaElement()
}

connection.appendMediaElement = function() {
    //alert(mediaElementList.length);
    if (mediaElementList.length == 0) {
        let ownMediaElement = getHTMLMediaElement(ownElement.element, {
            title: ownElement.userId,
            buttons: ['mute-audio', 'mute-video'],
            // buttons: ['record-audio','mute-audio', 'mute-video', 'full-screen', 'volume-slider', 'stop','take-snapshot'],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true,
            streamId: ownElement.streamId
        });

        connection.panel.innerHTML = connection.panel1;
        document.getElementById('video-container-opp').appendChild(ownMediaElement);
        ownMediaElement.media.setAttribute('autoplay', 'autoplay')
        ownMediaElement.media.setAttribute('playsinline', true)
        ownMediaElement.setAttribute('playsinline', true)

        setTimeout(function() {
            ownMediaElement.media.play();
        }, 100);

        ownMediaElement.id = ownElement.streamId;
        document.getElementById('our-face').innerHTML = '';
        document.getElementById('our-face').style.display = 'none';
    } else if (mediaElementList.length == 1) {
        let ownMediaElement = getHTMLMediaElement(ownElement.element, {
            title: ownElement.userId,
            buttons: ['mute-audio', 'mute-video'],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true,
            streamId: ownElement.streamId
        });

        connection.panel.innerHTML = connection.panel1;
        document.getElementById('our-face').innerHTML = '';
        document.getElementById('our-face').appendChild(ownMediaElement);
        document.getElementById('our-face').style.display = 'block';
        ownMediaElement.media.setAttribute('autoplay', 'autoplay')
        ownMediaElement.media.setAttribute('playsinline', true)
        ownMediaElement.setAttribute('playsinline', true)

        setTimeout(function() {
            ownMediaElement.media.play();
        }, 300);

        ownMediaElement.id = ownElement.streamId;

        let mainFaceElement = getHTMLMediaElement(mediaElementList[0].element, {
            title: mediaElementList[0].userId,
            buttons: [],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true
        });

        document.getElementById('video-container-opp').appendChild(mainFaceElement);
        mainFaceElement.media.setAttribute('autoplay', 'autoplay')
        mainFaceElement.media.setAttribute('playsinline', true)
        mainFaceElement.setAttribute('playsinline', true)

         setTimeout(function() {
            mainFaceElement.media.play();
        }, 400);

        mainFaceElement.id = mediaElementList[0].streamId;

    } else if (mediaElementList.length == 2) {
        document.getElementById('our-face').innerHTML = '';
        document.getElementById('our-face').style.display = 'none';
        let ownMediaElement = getHTMLMediaElement(ownElement.element, {
            title: ownElement.userId,
            buttons: ['mute-audio', 'mute-video'],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true,
            streamId: ownElement.streamId
        });

        connection.panel.innerHTML = connection.panel2;

        document.getElementById('videos-container').appendChild(ownMediaElement);
        ownMediaElement.media.setAttribute('autoplay', 'autoplay')
        ownMediaElement.media.setAttribute('playsinline', true)
        ownMediaElement.setAttribute('playsinline', true)

        setTimeout(function() {
            ownMediaElement.media.play();
        }, 500);

        ownMediaElement.id = ownElement.streamId;

        let mainFaceElement = getHTMLMediaElement(mediaElementList[0].element, {
            title: mediaElementList[0].userId,
            buttons: [],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true
        });

        document.getElementById('video-container-opp').appendChild(mainFaceElement);
        mainFaceElement.media.setAttribute('autoplay', 'autoplay')
        mainFaceElement.media.setAttribute('playsinline', true)
        mainFaceElement.setAttribute('playsinline', true)

        setTimeout(function() {
            mainFaceElement.media.play();
        }, 600);

        mainFaceElement.id = mediaElementList[0].streamId;


        let topFaceElement = getHTMLMediaElement(mediaElementList[1].element, {
            title: mediaElementList[1].userId,
            buttons: [],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true
        });

        document.getElementById('video-container-opps-1').appendChild(topFaceElement);
        topFaceElement.setAttribute('onclick', "maximizeVideo('" + mediaElementList[1].userId + "')")
        topFaceElement.media.setAttribute('autoplay', 'autoplay')
        topFaceElement.media.setAttribute('playsinline', true)
        topFaceElement.setAttribute('playsinline', true)
        setTimeout(function() {
            topFaceElement.media.play();
        }, 700);

        topFaceElement.id = mediaElementList[1].streamId;
    } else if (mediaElementList.length == 3) {
        document.getElementById('our-face').innerHTML = '';
        document.getElementById('our-face').style.display = 'none';
        let ownMediaElement = getHTMLMediaElement(ownElement.element, {
            title: ownElement.userId,
            buttons: ['mute-audio', 'mute-video'],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true,
            streamId: ownElement.streamId
        });

        connection.panel.innerHTML = connection.panel3;

        document.getElementById('videos-container').appendChild(ownMediaElement);
        ownMediaElement.media.setAttribute('autoplay', 'autoplay')
        ownMediaElement.media.setAttribute('playsinline', true)
        ownMediaElement.setAttribute('playsinline', true)

        setTimeout(function() {
            ownMediaElement.media.play();
        }, 800);

        ownMediaElement.id = ownElement.streamId;

        let mainFaceElement = getHTMLMediaElement(mediaElementList[0].element, {
            title: mediaElementList[0].userId,
            buttons: [],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true
        });

        document.getElementById('video-container-opp').appendChild(mainFaceElement);
        mainFaceElement.media.setAttribute('autoplay', 'autoplay')
        mainFaceElement.media.setAttribute('playsinline', true)
        mainFaceElement.setAttribute('playsinline', true)

        setTimeout(function() {
            mainFaceElement.media.play();
        }, 900);

        mainFaceElement.id = mediaElementList[0].streamId;

        var middleFaceElement = getHTMLMediaElement(mediaElementList[1].element, {
            title: mediaElementList[1].userId,
            buttons: [],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true
        });

        document.getElementById('video-container-opps-1').appendChild(middleFaceElement);
        middleFaceElement.media.setAttribute('autoplay', 'autoplay')
        middleFaceElement.setAttribute('onclick', "maximizeVideo('" + mediaElementList[1].userId + "')")
        middleFaceElement.media.setAttribute('playsinline', true)
        middleFaceElement.setAttribute('playsinline', true)

        setTimeout(function() {
            middleFaceElement.media.play();
        }, 1000);

        middleFaceElement.id = mediaElementList[1].streamId;

        let topFaceElement = getHTMLMediaElement(mediaElementList[2].element, {
            title: mediaElementList[2].userId,
            buttons: [],
            width: "100%",
            height: "100%",
            showOnMouseEnter: true
        });

        document.getElementById('video-container-opps-2').appendChild(topFaceElement);
        topFaceElement.media.setAttribute('autoplay', 'autoplay')
        topFaceElement.setAttribute('onclick', "maximizeVideo('" + mediaElementList[2].userId + "')")
        topFaceElement.media.setAttribute('playsinline', true)
        topFaceElement.setAttribute('playsinline', true)

        setTimeout(function() {
            topFaceElement.media.play();
        }, 1100);

        topFaceElement.id = mediaElementList[2].streamId;
    }

    connection.getMessageParticipant()
    return;
}

function maximizeVideo(userId) {
    let maxVideo = undefined
    mediaElementList.forEach(function(media, index) {
        if (media.userId == userId) {
            maxVideo = media
        }
    })
    if (!maxVideo) return;
    var i = mediaElementList.findIndex(o => o.userId === maxVideo.userId);
    if (i === 0) return;
    if (i > 0) {
        mediaElementList.splice(i, 1);
    }
    mediaElementList.unshift(maxVideo);
    connection.appendMediaElement()
}

function update(e) {

    // find index
    var i = arr.findIndex(o => o.v === e.v);

    // if already at start, nothing to do
    if (i === 0) return;

    // remove old occurrency, if existing
    if (i > 0) {
        arr.splice(i, 1);
    }

    // add e to the start
    arr.unshift(e);

    // keep array at the correct size
    arr.length = Math.min(arr.length, 4);
}

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


var videoDiv = document.getElementById('video-url');

var blobs = [];
var recorder;
var streamArray = [];
var audioTrackArray = [];

connection.onstream = function(event, isMe) {
    // var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
    audioTrackArray.push(event.stream.getAudioTracks()[0])
    streamArray.push(event.stream);
    if (isMe) {
        ownElement = {
            userId: event.userid,
            element: event.mediaElement,
            streamId: event.streamid,
            name: event.name
        }
        connection.appendMediaElement()
    } else {
        connection.pushMediaElement(event.userid, event.mediaElement, event.streamid, event.name)
     //   connection.appendMediaElement()
    }
    var streamId = event.streamid
};

// connection.onstream = function(event) {
//     event.mediaElement.removeAttribute('src');
//     event.mediaElement.removeAttribute('srcObject');
//     var video = document.createElement('video');
//     video.controls = true;
//     if(event.type === 'local') {
//         video.muted = true;
//     }
//     video.srcObject = event.stream;
//     var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
//     var mediaElement = getHTMLMediaElement(video, {
//         title: event.userid,
//         buttons: ['full-screen'],
//         width: width,
//         showOnMouseEnter: false
//     });
//     connection.videosContainer.appendChild(mediaElement);
//     setTimeout(function() {
//         mediaElement.media.play();
//     }, 5000);
//     mediaElement.id = event.streamid;
// };

connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

connection.onopen = function() {
    document.getElementById('btn-leave-room').disabled = false;
    if (document.getElementById('start-recording').disabled == true) {
        document.getElementById('start-recording').disabled = false;
    }
    // document.querySelector('p').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
};

connection.onclose = function() {
    // if (connection.getAllParticipants().length) {
    //     document.querySelector('p').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
    // } else {
    //     document.querySelector('p').innerHTML = 'session has been closed or all participants left.';
    // }
};

connection.onEntireSessionClosed = function(event) {
    document.getElementById('share-file').disabled = true;
    document.getElementById('input-text-chat').disabled = true;
    document.getElementById('btn-leave-room').disabled = true;

    document.getElementById('room-id').disabled = false;

    connection.attachStreams.forEach(function(stream) {
        stream.stop();
    });

    // don't display alert for moderator
    if (connection.userid === event.userid) return;
    document.querySelector('p').innerHTML = 'Entire session has been closed: ' + event.userid;
};

connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
    // seems room is already opened
    connection.join(useridAlreadyTaken);
};

function getElement(selector) {
    return document.querySelector(selector);
}

var main = getElement('.text-center');
//Open the Room
main.querySelector('#open-room').onclick = function() {
    let username = document.getElementById('username');
    if (!username.value || username.value.length == 0) {
        alert('Please enter your name to start conversation')
        return
    }
    connection.name = username.value;
    var roomInfo = this.parentNode.querySelector('#room-id');
    if (!roomInfo.value || !roomInfo.value.length) {
        roomInfo.focus();
        return alert('Your MUST Enter Room id!');
    }

    if (username.value.toUpperCase() == "PHYSICIAN") {
        $("#soap-hide").show();
    } else {
        $("#soap-hide").hide();
    }

    connection.channel = roomInfo.value;
    connection.checkPresence(roomInfo.value, function(isRoomExists) {
        if (isRoomExists) {
            enableInputButtons();
            roomInfo.focus();
            // return alert('Room id already found!');
            disableInputButtons();
            connection.join(roomInfo.value);
            $(".create-room").hide();
            $(".video-chat").show();
            //connection.join(roomInfo.value);
        } else {
            connection.open(roomInfo.value, function() {
                showRoomURL(connection.sessionid);
            });
        }
    });
    disableInputButtons();
};

//leave the room
document.getElementById('btn-leave-room').onclick = function() {
    this.disabled = true;
    if (connection.isInitiator) {
        // use this method if you did NOT set "autoCloseEntireSession===true"
        connection.closeEntireSession(function() {
            document.querySelector('p').innerHTML = 'Entire session has been closed.';
        });
    } else {
        connection.leave();
    }
    window.location.reload();
};

function disableInputButtons() {
    document.getElementById('room-id').disabled = true;
}

function enableInputButtons() {
    document.getElementById('room-id').disabled = false;
}

// ......................................................
// ......................Handling Room-ID................
// ......................................................

function showRoomURL(roomid) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;

    var html = '';

    html += 'Request Room id : <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
    html += '<br>';

    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;

    roomURLsDiv.style.display = 'block';
    $(".create-room").hide();
    $(".video-chat").show();
}

document.getElementById('input-text-chat').onkeyup = function(e) {
    if (e.keyCode != 13) return;
    sendMessage()
};

// document.querySelector('#start-recording').onclick = function() {
//     if(isSafari) {
//         alert('This browser only supports audio recording.')
//         // $('#stop-rec-btn').hide();
//         // $('#start-rec-btn').hide();
//         // return false;
//     }
//     this.disabled = true;
//     $('#stop-rec-btn').show();
//     $('#start-rec-btn').hide();
//     if (multiStreamRecorder == undefined) {
//         captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
//     }
//     if (multiStreamRecorder != undefined) {
//         multiStreamRecorder.stop();
//         captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
//         document.querySelector('#stop-recording').disabled = false;
//         //document.querySelector('#pause-recording').disabled = false;
//     }

//     // console.log(streamArray)

//     // var recorderRTC = RecordRTC(streamArray, {
//     //     type: 'audio', // audio or video or gif or canvas
//     //     recorderType: MediaStreamRecorder
//     // });
//     // recorderRTC.startRecording();

// };


//multiStreamRecorder
var multiStreamRecorder;
var index = 1;

// document.querySelector('#stop-recording').onclick = function() {
//     this.disabled = true;
//     $('#stop-rec-btn').hide();
//     $('#start-rec-btn').show();
//     if(!isSafari) {
//         multiStreamRecorder.stop(function(){
//             var blob = multiStreamRecorder.blob;
//             var recordedVideoUrl = document.URL.replace('index', 'video');
//             var a = document.createElement('a');
//             var url = URL.createObjectURL(blob);
//             appendLink(blob);
//         });
//         async function appendLink(blob) {
//             await blobUtil.blobToBase64String(blob).then(async function(base64String) {
//                 var data = {
//                     video : base64String
//                 }
//                 var responsedata = ajaxPostJQuery('https://proglint.com:8000/uploadVideo', data);
//                 // var responsedata = ajaxPostJQuery('http://localhost:8000/uploadVideo', data)
//                 var parsealldrugsearchdata = $.parseJSON(responsedata);
//                 window.open(parsealldrugsearchdata.path, '_blank')
//                 return responsedata;
//             }).catch(function(err) {
//                 console.log(err);
//             });
            
//         }
//     } else {
//         multiStreamRecorder.stop(function(){
//             var blob = multiStreamRecorder.blob;
//             var recordedVideoUrl = document.URL.replace('index', 'video');
//             var a = document.createElement('a');
//             var url = URL.createObjectURL(blob);
//             appendLink(blob);
//         });
//         async function appendLink(blob) {
//             await blobUtil.blobToBase64String(blob).then(async function(base64String) {
//                 console.log(base64String)
//                 var data = {
//                     audio : base64String
//                 }
//                 var responsedata = ajaxPostJQuery('https://proglint.com:8000/uploadAudio', data);
//                 // var responsedata = ajaxPostJQuery('http://localhost:8000/uploadAudio', data)
//                 var parsealldrugsearchdata = $.parseJSON(responsedata);
                
                
//                 window.open(parsealldrugsearchdata.path, '_blank')
                 
//                 return responsedata;
//             }).catch(function(err) {
//                 console.log(err);
//             });
           
//         }
//     }
    
//     connection.send({
//         type : 'ENDCALL'
//     });

//     //document.querySelector('#pause-recording').disabled = true;
//     document.querySelector('#start-recording').disabled = false;
// };

document.querySelector('#start-recording').onclick = function() {
    if(isSafari) {
        alert('This browser not supports recording.')
        $('#stop-rec-btn').hide();
        $('#start-rec-btn').hide();
        return false;
    }
    this.disabled = true;
    $('#stop-rec-btn').show();
    $('#start-rec-btn').hide();
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
    $('#stop-rec-btn').hide();
    $('#start-rec-btn').show();
    document.querySelector('#start-recording').disabled = false;
};



// function onMediaSuccess(stream) {
//     if(!isSafari) {
//         // if (multiStreamRecorder && multiStreamRecorder.stream) {
//         //     console.log('Existing player');
//         //     multiStreamRecorder.stop();
//         //     multiStreamRecorder = new MultiStreamRecorder([stream]);
//         //     multiStreamRecorder.mimeType = 'video/mp4';
//         //     multiStreamRecorder.stream = stream;
//         //     if (streamArray.length > 1) {
//         //         console.log('New media player with multiple stream');
//         //         multiStreamRecorder = new MultiStreamRecorder(streamArray);
//         //     }
//         // } else {
//             if (streamArray.length > 1) {
//                 console.log('New media player with multiple stream');
//                 multiStreamRecorder = new MultiStreamRecorder(streamArray);
//                 multiStreamRecorder.record();
//             } else {
//                 console.log('New media player with single stream');
//                 multiStreamRecorder = new MultiStreamRecorder([stream]);

//             }
//             multiStreamRecorder.mimeType = 'video/mp4';
//             multiStreamRecorder.stream = stream;
//         // }

//         // multiStreamRecorder.previewStream = function(stream) {
//         // 	connection.videosContainer.src = URL.createObjectURL(stream);
//         // 	connection.videosContainer.play();
//         // };

//         // multiStreamRecorder.ondataavailable = function(blob) {
//         //     appendLink(blob);
//         // };

//         async function appendLink(blob) {

//             var recordedVideoUrl = document.URL.replace('index', 'video');
//             // console.log(recordedVideoUrl);
//             // var recordedVideoDiv = recordedVideoUrl.getElementById('recorded-video-stream');

//             //var recordedVideoDiv = recordedDocument.getElementById('video-url');
//             //var recordedDocument = recordedDocument.createElement('a');
//             var a = document.createElement('a');
//             var url = URL.createObjectURL(blob);
//             // window.open(url, '_blank')
//             a.target = '_blank';
//             a.innerHTML = 'Your video is Here ' + (blob.type == 'audio/ogg' ? 'Audio' : 'Video') + ' No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ')';
//             // Time Length: ' + getTimeLength(timeInterval);
//             a.href = URL.createObjectURL(blob);
//             // console.log(recordedVideoUrl);
//             await blobUtil.blobToBase64String(blob).then(async function(base64String) {
//                 console.log(base64String);
//                 var data = {
//                     video : base64String
//                 }
//                 var responsedata = ajaxPostJQuery('https://proglint.com:8000/uploadVideo', data);
//                 // var responsedata = ajaxPostJQuery('http://localhost:8000/uploadVideo', data)
//                 var parsealldrugsearchdata = $.parseJSON(responsedata);
//                 window.open(parsealldrugsearchdata.path, '_blank')
                
//                 return responsedata;
//             }).catch(function(err) {
//                 console.log(err);
//             });
            
//             videoDiv.appendChild(a);
//             videoDiv.appendChild(document.createElement('hr'));


//             //  recordedDocument.target = '_blank';
//             //  recordedDocument.innerHTML = 'Your video is Here ' + (blob.type == 'audio/ogg' ? 'Audio' : 'Video') + ' No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ')';
//             //  recordedDocument.href = URL.createObjectURL(blob);
//             //  recordedVideoDiv.appendChild(a);
//             //  recordedVideoDiv.appendChild(document.createElement('hr'));
//         }

//         // var timeInterval = 0;
//         // get blob after specific time interval
//         // multiStreamRecorder.start(timeInterval);

//         // document.querySelector('#add-stream').onclick = function() {
//         // 	if(!multiStreamRecorder || !multiStreamRecorder.stream) return;
//         // 	multiStreamRecorder.addStream(multiStreamRecorder.stream);
//         // };

        
//         //document.querySelector('#pause-recording').disabled = false;
//     } else {
//         if(isSafari) {
//             var ac = new (window.webkitAudioContext)();
//             console.log(ac)
//         } else {
//             var ac = new AudioContext();
//         }
        
//         const sources = audioTrackArray.map(t => ac.createMediaStreamSource(new MediaStream([t])));
//         const dest = ac.createMediaStreamDestination();

//         // Mixing
//         sources.forEach(s => s.connect(dest));
//         console.log(dest.stream.getAudioTracks())
//         multiStreamRecorder = new StereoAudioRecorder(dest.stream, {
//             sampleRate: 44100,
//             bufferSize: 4096,
//             numberOfAudioChannels : audioTrackArray.length
//         });
//         multiStreamRecorder.record();
        
//     }
//     document.querySelector('#stop-recording').disabled = false;
// }

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
        // a.target = '_blank';
        // a.innerHTML = 'Your video is Here ' + (blob.type == 'audio/ogg' ? 'Audio' : 'Video') + ' No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ')';                  
        // // Time Length: ' + getTimeLength(timeInterval);
        // a.href = URL.createObjectURL(blob);
        // console.log(recordedVideoUrl);
        // blobUtil.blobToBase64String(blob).then(function (base64String) {
        // console.log(base64String);
        // }).catch(function (err) {
        // console.log();
        // });
        // videoDiv.appendChild(a);
        // videoDiv.appendChild(document.createElement('hr'));


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
if(isSafari) {
    var mediaConstraints = {
        audio: true
    };
} else {
    var mediaConstraints = {
        audio: true,
        video: true
    };
}


function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

connection.maxParticipantsAllowed = 4;