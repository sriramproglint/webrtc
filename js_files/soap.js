var soapActive = false;

function showSoap(){
    closeChat();
    if(!soapActive){
        soapActive = true;
        if ($(window).width() < 869) {
            $('.video-side').css('display', 'none');
            $('.chat-par-box').css('display', 'table-cell');
            $(".encounter-tabs>ul.nav.nav-tabs.accordingBlock").css('display', 'none');
            $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").css('display', 'block');
            $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").css('display', 'none');
        } else {
            if ($('.chat-par-box').hasClass('hide-box')) {
                $('.chat-par-box').css({
                    "display": "table-cell",
                    "width": "30%"
                });
                $('.chat-par-box').removeClass('hide-box');
            } else {
                $('.chat-par-box').css({
                    "display": "none"
                });
                $('.chat-par-box').addClass('hide-box');
            }
            $('.video-side').css('display', 'table-cell');
            // $('.chat-par-box').css('display', 'table-cell');
        }
    }else{
        soapActive = false;
        $('.video-side').css('display', 'table-cell');
        $('.chat-par-box').css('display', 'none');
    }
}

function showSoapTitle() {
    $(".encounter-tabs>ul.nav.nav-tabs.accordingBlock").css('display', 'block');
    $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").css('display', 'none');
    $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").css('display', 'block');
}

function hideSoapTitle() {
    $(".encounter-tabs>ul.nav.nav-tabs.accordingBlock").css('display', 'none');
    $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").css('display', 'block');
    $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").css('display', 'none');
}

$("div.encounter-tabs>ul>li>").click(function () {
    if ($(window).width() < 1350) {
        $(".encounter-tabs>ul.nav.nav-tabs.accordingBlock").css('display', 'none');
        $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").css('display', 'block');
        $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").css('display', 'none');
    }
});

function addallergy() {
    $("#hideallergy").show();
}

function medication_btn() {
    $("#addmedication").hide();
    $("#selectmedication").hide();
    $("#datemedication").hide();
    $("#select_medication").show();
}

function Diagnosis() {
    $("#Diagnosis").show();
}

function tabColour(val) {
    $('.accordingBlock li').removeClass('active');

    $("." + val).addClass('active');
}

function adddiagnosis(val) {
    var value = val.replace(/[\/\\,()~%!.'":{}]/g, '').replace(/[\[\]]/g, '');
    var allsearchdata = ajaxGetJQuery(restApiBaseUrl+'/drug?q=' + val);
    var parseallsearchdata = $.parseJSON(allsearchdata);
    console.log(parseallsearchdata.hits.hits)
    var availableTags = [];
    var icdcodes = [];

    var friendsArray = [];
    diagnosisrowid = 1;
    for (prop in parseallsearchdata.hits.hits) {
        var friends = {
            "id": parseallsearchdata.hits.hits[prop]._source.code,
            "name": parseallsearchdata.hits.hits[prop]._source.description,
            "value": parseallsearchdata.hits.hits[prop]._source.description,
            "rowid": diagnosisrowid
        };
        diagnosisrowid++;
        friendsArray.push(friends);
    }

    $("#tags").autocomplete({
        source: function(request, response) {
            response(friendsArray);
            return;
        },
        select: function(e, ui) {
            console.log(ui.item.rowid);
            $("#selectdiagnosis").show();
            selectdiagnosis(ui.item.id, ui.item.value, ui.item.rowid)
        },

        change: function(e, ui) {
            //alert("changed!");
        }
    });
}

$(".ui-helper-hidden-accessible").hide();

function selectdiagnosis(icd_code, icd_desc, icd_rowid) {
    $("#DiagnosisRecord").html('<tr diagrow-id="' + icd_rowid + '"><td>ICD-10</td><td class="diagnosis-icdcode">' + icd_code + '</td><td class="diagnosis-description">' + icd_desc + '</td></tr>');
    $("#selectdiagnosis").hide();
    $("#datediagnosis").show();
    $("#adddiagnosis").show();
}

function addmedication(val) {
    var encodedString = val.replace(/[\/\\,()~%!.'":{}]/g, '').replace(/[\[\]]/g, '');
    var alldrugsearchdata = ajaxGetJQuery(restApiBaseUrl+'/medication?q=' + encodedString);
    var parsealldrugsearchdata = $.parseJSON(alldrugsearchdata);
    console.log(parsealldrugsearchdata.hits.hits)
    var availabledrugTags = [];
    var drugcodes = [];
    var drugArray = [];
    medicationrowid = 1;
    for (drug in parsealldrugsearchdata.hits.hits) {

        var drugsdata = {
            "id": parsealldrugsearchdata.hits.hits[drug]._source.CODE,
            "name": parsealldrugsearchdata.hits.hits[drug]._source.STR,
            "value": parsealldrugsearchdata.hits.hits[drug]._source.STR,
            "medirowid": medicationrowid
        };
        medicationrowid++;
        drugArray.push(drugsdata);
    }
    $("#drugtags").autocomplete({
        source: function(request, response) {
            response(drugArray);
            return;
        },
        select: function(e, ui) {
            //console.log(e);
            console.log(ui.item.value);
            console.log(ui.item.id);
            //alert(e.value);
            $("#selectmedication").show();
            selectmedication(ui.item.id, ui.item.value, ui.item.medirowid)


        },

        change: function(e, ui) {
            //alert("changed!");
        }
    });
}

function selectmedication(drug_code, drug_desc, icd_medirowid) {
    $("#MedicationRecord").html('<tr medirow-id="' + icd_medirowid + '"><td>ICD-10</td><td class="drug-icdcode">' + drug_code + '</td><td class="drug-description">' + drug_desc + '</td></tr>');
    $("#selectmedication").hide();
    $("#addmedication").show();
    $("#datemedication").show();
}