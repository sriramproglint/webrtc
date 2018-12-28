/**
 * see https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest
 * 
 * @deprecated use the JQuery counterpart in this file.
 * @param strURL
 * @param elemId
 * @param attr
 * @param val
 */
function ajaxPost(strURL, elemId, attr, val) {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('POST', strURL, true); // the 3rd arg is asynch=true.

    self.xmlHttpReq.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4 && elemId) {
            document.getElementById(elemId).innerHTML = self.xmlHttpReq.responseText;
        }
    }
    self.xmlHttpReq.send(attr + '=' + val);
}

/**
 * see https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest
 * 
 * @deprecated use the JQuery counterpart in this file.
 * @param strURL
 * @param elemId
 * @param attr
 * @param val
 */
function ajaxGet(strURL, elemId, attr, val) {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('GET', strURL, true); // the 3rd arg is asynch=true.

    self.xmlHttpReq.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4 && elemId) {
            document.getElementById(elemId).innerHTML = self.xmlHttpReq.responseText;
        }
    }
    self.xmlHttpReq.send(attr + '=' + val);
}

function ajaxGetJQuery(strUrl, data) {

    // this function doesn't work on doctor_chat page.
    var myData = '';
    $.ajax({
        url: strUrl,
        global: false,
        type: "GET",
        data: data, // the data is in the format attr=val&attr2=val2...
        dataType: "html",
        async: false,

        success: function(result, status, xhr) {
            // alert(result);
            // alert(xhr.responseText);
            // alert(status);
            myData = result;
        },
        error: function(xhr, status, error) {
            alert(error);
        },

        complete: function(response, status, xhr) {
            // alert(response);
            // alert(satus);
            // alert(xhr);
        }
    });
    return myData;

}

function ajaxPostJQuery(strUrl, data) {

    // this function doesn't work on doctor_chat page.
    var myData = '';
    $.ajax({
        type: "POST",
        url: strUrl,
        // global: false,
        data: data, // the data is in the format attr=val&attr2=val2
        dataType: "html",
        async: false,

        success: function(result, status, xhr) {
            // alert(xhr.responseText);
            myData = result;
            // alert(myData);
        },

        error: function(xhr, status, error) {
            // alert('error');
            alert(error);
        },

        complete: function(response, status, xhr) {
            // alert(response);
            // alert(satus);
            // alert(xhr);
        }
    });

    /*
     * $.post(strUrl, data, function(result, status, xhr){ alert(result);
     * alert(xhr.responseText); alert(status); myData = result; });
     */
    return myData;

}