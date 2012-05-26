
function loopVersionCheck() {
    if (doVersionCheck == 1) {
        check_ajax_version('saveLocal');
    }
    setTimeout("loopVersionCheck();", currentVersionCheck);
}

function loopDisplayManifest() {
    check_ajax_version('skipConfirm');
    setTimeout("loopDisplayManifest();", currentVersionCheck);
}


// Run Ajax Version Check
function check_ajax_version() {
    skipConfirm = 0;
    saveLocal = 0;
    var argLen = arguments.length;

    if (argLen > 0) {
        for (var i = 0; i < argLen; i++) {
            if (arguments[i] == "skipConfirm") skipConfirm = 1;
            if (arguments[1] == "saveLocal") saveLocal = 1;
        }
    }

    $('body').css('cursor', 'wait');
    $('#fetch_data').css('cursor', 'wait');

    $.ajax({
        url: ajaxUrl,
        cache: false,
        dataType: 'text',
        type: 'post',
        timeout: Math.ceil(defaultVersionCheck / 3),
        data: {
            'direction': 'VERSION'
        },
        success: function (textData) {
            ajax_version = textData;
            if (ajax_version != new String(local_version) && skipConfirm == 1) {
                if (saveLocal == 0) fetch_ajax(); else fetch_ajax('DoSave');
            } else if (ajax_version != new String(local_version)) {
                if (confirm("New Server Version, Fetch Data?")) {
                    if (saveLocal == 0) fetch_ajax(); else fetch_ajax('DoSave');
                } else {
                    doVersionCheck = 0;
                }
            }
        },
        complete: function (xmlStatus, txtStatus) {
            console.log(txtStatus);
            console.log(xmlStatus);

            if (txtStatus == 'success' && !!xmlStatus.statusText && xmlStatus.statusText == "OK") {
                $('#majorError').hide();
                majorErrorCnt = 0;
                currentVersionCheck = defaultVersionCheck;

                $('body').css('cursor', '');
                $('#fetch_data').css('cursor', 'pointer');

            } else {
                $('#majorError').show();
                majorErrorUpdates();
            }


        }
    });
}

function majorErrorUpdates() {
    majorErrorCnt++;

    if (majorErrorCnt < 2) {
        $('#majorError').html('<br /><br /><br />SYSTEM ERROR<br /><br /><br />. . . Rebooting . . .<br /><br /><br />');
    } else if (majorErrorCnt == 3) {
        $('#majorError').html('<br /><br /><br />SYSTEM ERROR<br /><br /><br />. . . Attempting Network Salvation Mode . . .<br /><br /><br />');
        currentVersionCheck = 260000;
    }

}


function removeHighlights() {
    $('.highlight').each(function () {
        var highlightTxt = $(this).html();
        $(this).replaceWith(highlightTxt);
    });
}

function clean_data() {

    engine_rdy.rem('jumperlist_html');
    engine_rdy.rem('jumperdb_html');
    engine_rdy.rem('manifest_html');
    engine_rdy.rem('messagelist_html');
    engine_rdy.rem('version');
    engine_rdy.rem('updateWoSave');

    manifestStartup();
    //clean_ajax();

}




$(function () {
    var self = this;
    self.input = $("#searchInput");

    //handles searching the document
    self.performSearch = function () {

        //create a search string
        var phrase = self.input.val().replace(/^\s+|\s+$/g, "");
        phrase = phrase.replace(/\s+/g, "|");

        //make sure there are a couple letters
        if (phrase.length == 1) { return; }

        //append the rest of the expression
        phrase = ["(", phrase, ")"].join("");

        //search for any matches
        var count = 0;
        $('.manifest_pane').find('.jumpername').each(function (i, v) {

            //replace any matches
            var block = $(v);
            block.html(
							block.text().replace(
								new RegExp(phrase, "gi"),
								function (match) {
								    count++;
								    return ["<span class='highlight'>", match, "</span>"].join("");
								}));

        });

        if (phrase == '()') {
            $(".result-count").text('');
        } else {
            //update the count
            $(".result-count").text(count + ' results');
        }

        //clear this search attempt
        //should be gone anyways...
        self.search = null;

    };

    self.search;
    self.input.keyup(function (e) {
        if (self.search) { clearTimeout(self.search); }

        //start a timer to perform the search. On browsers like
        //Chrome, Javascript works fine -- other less performant
        //browsers like IE6 have a hard time doing this
        self.search = setTimeout(self.performSearch, 300);

    });

});

function activateAutoComplete() {
  console.log('activate');
  console.log(jumperlist_names);
  $('input[name="inp_jumpername"]').autocomplete({
    source: jumperlist_names,
    select: function (event, ui) {

      var selDB = $("#jumperdatabase_sheet").find("li#" + ui.item.id);
      if (!!selDB && selDB.length > 0) {
        var jLi = $('input[name="inp_jumpername"]').closest('li');

        jLi.attr('id', ui.item.id);

        var jNameDiv = jLi.find('.jumpername');
        jNameDiv.text(ui.item.label);

        jLi.attr('title', ui.item.real);
        removeJumperFromClipboard(ui.item.id);

        bindManifestJumper(jNameDiv);
        jumperName_Editing = 0;

        setTimeout("save_data();", 200);
      }
    }
  });

}

function doSelectDisable() {
    $('div').each(function () { $(this).disableSelection(); });
}


function parseTimer(ele) {
    var dn = new Date();
    var dMs = dn.getTime();
    var dMLs;

    dMLs = new Number($(ele).find('.messageEpoch').text().replace(/[^0-9]/g, ""));
    //if (dMs > dMLs) {
    //  $(ele).find('.messageTimer').text('0');
    //} else {

    var tL = Math.floor(dMLs - dMs);
    var tLDisplay = "";
    var tLSecs = Math.floor((tL / 1000) % 60);

    if (tL < 30) {
        tLDisplay = "Right Now!";
    } else if (tL < 60030) {
        tLDisplay = "1 Minute Call! " + tLSecs + " Seconds";
    } else {
        if (tLSecs < 10) tLSecs = "0" + tLSecs;
        var tLMins = Math.floor((tL / 60000) % 60);
        var tLHours = Math.floor((tL / 3600000) % 24);
        var tLDays = Math.floor((tL / 36000000) / 24);

        if (tLDays > 0) {
            tLDisplay = tLDisplay + tLDays + " Day";
            if (tlDays > 1) tLDisplay = tLDisplay + "s";
            if (tLHours > 0) tLDisplay = tLDisplay + ", ";
        }
        if (tLHours > 0) {
            tLDisplay = tLDisplay + tLHours + " Hour";
            if (tLHours > 1) tLDisplay = tLDisplay + "s";
            if (tlMins > 0) tLDisplay = tLDisplay + ", ";
        }
        if (tLMins > 0) {
            tLDisplay = tLDisplay + tLMins + "." + tLSecs + " Minutes";
        }

    }

    $(ele).find('.messageTimer').text(tLDisplay);

    //}
    return ele;
}








function checkDuplicates_allSheets() {
    var dupList = "";
    $('#manifest_sheet_container').find('li.jumpSlot').each(function () {
        var tID = $(this).attr('id');
        if (tID != "" && tID != "blankSlot" && $('#manifest_sheet_container').find('li#' + tID).length > 1) {

            $('#manifest_sheet_container').find('li#' + tID).each(function () {
                var mPane = $(this).closest('li.manifest_pane');
                dupList = dupList + 'Jumper: ' + $(this).find('.jumpername').text() + ' - Load: ' + mPane.find('.loadinformation').text() + ' - Slot: ' + $(this).find('.left_number').text() + '\n';
            });
        }
    });
    alert('Duplicates \n' + dupList);
}

function checkMissing_database() {
    var missingList = "";
    $('#jumperdatabase_sheet').find('li.jumpSlot').each(function () {
        var tID = $(this).attr('id');
        if (tID != "" && tID != "blankSlot" && $('#manifest_sheet_container').find('li#' + tID).length == 0) {
            missingList = missingList + 'Jumper: ' + $(this).find('.jumpername').text() + '\n';
        }
    });
    alert('Missing Jumpers\n' + missingList);
}		
			
			