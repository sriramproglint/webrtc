function showChat() {
    $('.soap-par-box').css('display', 'none');
    $('.video-side').css('display', 'table-cell');
    $('.soap-par-box').addClass('hide-box');
    $('#sidebar_secondary').addClass('popup-box-on');
    $(".collapse").collapse('show');
}

function closeChat() {
    $('#sidebar_secondary').removeClass('popup-box-on');
}

connection.getMessageParticipant = function() {
    var msgUsers = [];
    mediaElementList.forEach(function(media, index) {
        msgUsers.push(media.userId)
    })
    let data = `${msgUsers.length > 0 ? msgUsers.toString()+', You' : 'You'}`
    return;
}

connection.onmessage = appendDIV;
connection.filesContainer = document.getElementById('file-container');

function sendMessage() {
    var data = document.getElementById('input-text-chat');
    data.value = data.value.replace(/^\s+|\s+$/g, '');
    if (!data.value.length) return;

    connection.send({
        data: data.value,
        name: connection.name
    });
    appendDIV({
        data: data.value,
        userid: connection.userid,
        name: connection.name
    }, true);
    data.value = '';
}

var chatContainer = document.querySelector('.chat-output');

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + '' + ampm;
    return strTime;
}

function appendDIV(event, isMe) {
    var div = document.createElement('div');
    let htmlStr = '';
    if (isMe) {
        htmlStr = `<div class="second-chat">
                        <div class="media">
                            <div class="media-body with-caption-right">
                                <div class="message">
                                    <p>
                                        ${event.data || event} &nbsp;&nbsp;
                                        <span class="chat_message_time pull-right">${formatAMPM(new Date())}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>`
            // <p>${event.name}</p>
            // <span class="userName">${event.name}:</span>
    } else {
        htmlStr = `<div class="first-chat">
                        <div class="media">
                            <div class="media-body with-caption-left">
                                <div class="message">
                                    <h6 class="capitalize">${event.data.name}</h6>
                                    <p>
                                        ${event.data.data || event.data} &nbsp;&nbsp;
                                        <span class="chat_message_time pull-right">${formatAMPM(new Date())}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>`
    }

    div.innerHTML = htmlStr;
    chatContainer.insertBefore(div, chatContainer.lastChild);
    div.tabIndex = 0;
    div.focus();

    document.getElementById('input-text-chat').focus();
}

document.getElementById('share-file').onclick = function() {
    var fileSelector = new FileSelector();
    fileSelector.selectSingleFile(function(file) {
        connection.send(file);
    });
};