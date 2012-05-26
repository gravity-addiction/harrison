
function startupClipboard() {
  list_jumpers();
  activateClipboard();
  draggableClipboard();
}

function draggableClipboard() {
    $('#divClipboard').draggable({ handle: ".handleBar" });
}

function activateClipboard() {

  // Captain Only Functions
  if (userMode == "admin" || userMode == "management" || userMode == "captain") {
    $('#divClipboard').show();
  } else {
    $('#divClipboard').hide();
  }

}

// List Jumpers HTML Panes
function list_jumpers() {
  $("#jumperdatabase_sheet").html(jumperdb_html);
  $("#jumperlist_sheet").html(jumperlist_html);
}





function generateNewID() {
    jumperid = 0;
    hasID = 0;
    cntEr = 0;
    while (hasID == 0) {
        cntEr++;
        jumperid++;

        idFound = 0;
        $('#jumperdatabase_sheet').find('li.jumpSlot').each(function () {
            if ($(this).attr('id') == jumperid) idFound = 1;
        });
        if (cntEr > 1000) { alert("1000 Jumper Limit Reached, Failed to Add User, Clean Database"); hasId = 2; }
        if (idFound == 0) { hasID = 1; }
    }

    return jumperid;
}
function addNewName(newName) {
    jumperName = newName.replace(/^\s+|\s+$/g, "");
    if (jumperName == '') { $('div[id="newName_error"]').html('Blank Name'); return; }
    $('div[id="newName_error"]').html('');

    licID = newName.match(/\[.*\]/gi);
    if ($('div[id="manifest_sheet_container"]').html().indexOf(licID) >= 0 || $('div[id="jumperlist_sheet"]').html().indexOf(licID) >= 0) {
        $('div[id="newName_error"]').html(licID + ' ID already exists');
        return;
    }


    jumperid = generateNewID();

    if (jumperid > 0) {
        addJumperListName($('#jumperlist_sheet'), jumperid, jumperName);
        addJumperDatabase(jumperid, jumperName);
        $('#newName').val('');
    }
}

function addJumperListName(ele, i, newName) {
    if (newName == undefined) { return; }
    jumperName = newName.replace(/^\s+|\s+$/g, "");
    if (jumperName == '') { return; }

    var jumperHtml = '';
    jumperHtml = jumperName;

    var lidata = '<li id="' + i + '" class="jumpSlot" title="' + jumperName + '"><div class="left_number"></div><div class="right_number"></div><div class="jumpername">' + jumperHtml + '</div></li>';
    appendJumperList(ele, lidata);

}


function addJumperDatabase(i, newName) {

    if (newName == undefined) { return; }
    var jumperName = newName.replace(/^\s+|\s+$/g, "");
    if (jumperName == '') { return; }

    var lidata = '<li id="' + i + '" class="jumpSlot" title="' + jumperName + '"><div class="jumpername">' + jumperName + '</div></li>';
    appendJumperList($("#jumperdatabase_sheet"), lidata);
    
    checkJumperDatabaseEntries();
    sortJumperDatabaseEdit();
}

function checkJumperDatabaseEntries() {
    $('#jumperdatabase_sheet').find('li.jumpSlot').each(function () {

        updateJumperDatabaseEntry(this, '');

    });
}

function updateJumperDatabaseEntry(ele) {
    var jumperName = $(ele).find('.jumpername').text();
    var jumperFirst = $(ele).find('.jumperFirst').text();
    var jumperLast = $(ele).find('.jumperLast').text();
    var jumperFaiLic = $(ele).find('.jumperFaiLic').text();
    var jumperFaiNation = $(ele).find('.jumperFaiNation').text();

    var jumperEntry = '<div class="jumpername" title="'+jumperFirst+' '+jumperLast+'">' + jumperName + '</div>';
    jumperEntry = jumperEntry + '<div class="dbData">';
    jumperEntry = jumperEntry + '<div>First: <span class="jumperFirst">' + jumperFirst + '</span></div>';
    jumperEntry = jumperEntry + '<div>Last: <span class="jumperLast">' + jumperLast + '</span></div>';
    jumperEntry = jumperEntry + '<div>FAI #: <span class="jumperFaiLic">' + jumperFaiLic + '</span></div>';
    jumperEntry = jumperEntry + '<div>Nation: <span class="jumperFaiNation">' + jumperFaiNation + '</span></div>';
    jumperEntry = jumperEntry + '</div>';

    $(ele).html(jumperEntry);
}

function activateJumperDatabaseEdit() {
    $("#jumperdatabase_sheet li").each(function (i) {
        /* dbl click remove of jumpers in database */
        $(this).unbind("click").bind("click", function () {
            editJumperDatabaseEntry(this);
        });
    });
}

function sortJumperDatabaseEdit() {
    var mylist = $('#jumperdatabase_sheet');
    var listitems = mylist.children('ol').get();
    listitems.sort(function (a, b) {
        return $(a).find('.jumpername').text().toUpperCase().localeCompare($(b).find('.jumpername').text().toUpperCase());
    })
    $.each(listitems, function (idx, itm) { mylist.append(itm); });
}

function editJumperDatabaseEntry(ele) {
    $('#jumperdatabase_sheet').find('li.jumpSlot').each(function () { cleanJumperDatabaseEdit(this); });
    activateJumperDatabaseEdit();

    $(ele).unbind('click');

    var jumperEntryData = $('<div class="dbEdit"></div>');
    var inpEdit;

    inpEdit = $('<input type="text" class="jumperNameEdit" style="width: 60%;"/>').val($(ele).find('.jumpername').text());
    jumperEntryData.append($('<div>Nick: </div>').append(inpEdit));
    inpEdit = $('<input type="text" class="jumperFirstEdit" style="width: 60%;"/>').val($(ele).find('.jumperFirst').text());
    jumperEntryData.append($('<div>First: </div>').append(inpEdit));
    inpEdit = $('<input type="text" class="jumperLastEdit" style="width: 60%;" />').val($(ele).find('.jumperLast').text());
    jumperEntryData.append($('<div>Last: </div>').append(inpEdit));
    inpEdit = $('<input type="text" class="jumperFaiLicEdit" style="width: 60%;" />').val($(ele).find('.jumperFaiLic').text());
    jumperEntryData.append($('<div>Fai Lic: </div>').append(inpEdit));
    inpEdit = $('<input type="text" class="jumperfaiNationEdit" style="width: 60%;" />').val($(ele).find('.jumperfaiNation').text());
    jumperEntryData.append($('<div>Nation: </div>').append(inpEdit));

    inpEdit = $('<input type="button" value=" Save " style="text-align: center;" class="saveEdit" />').bind('click', function () {
        saveJumperDatabaseEntry($(this).closest('li.jumpSlot'));
    });
    jumperEntryData.append($('<div style="text-align:center;"></div>').append(inpEdit));

    //jumperEntryData.append($('<div></div>').append('First: ').append());

    $(ele).append(jumperEntryData);

    /*
    jumperEntryEdit = jumperEntryEdit + '<div class="dbData">';
    jumperEntryEdit = jumperEntryEdit + '<div>First: <input type="text" class="jumperFirst" value="'+jumperFirst+'" />'+jumperFirst+'</span></div>';
    jumperEntryEdit = jumperEntryEdit + '<div>Last: <input type="text" class="jumperLast" value="'+jumperLast+'" />'+jumperLast+'</span></div>';
    jumperEntryEdit = jumperEntryEdit + '<div>FAI #: <input type="text" class="jumperFaiLic" value="'+jumperFaiLic+'" />'+jumperFaiLic+'</span></div>';
    jumperEntryEdit = jumperEntryEdit + '<div>Nation: <input type="text" class="jumperFaiNation" value="'+jumperFaiNation+'" />'+jumperFaiNation+'</span></div>';
    jumperEntryEdit = jumperEntryEdit + '</div>';
    */
    $(ele).css('background-color', '#FC0');
    $(ele).find('.jumpername').css({ 'font-size': '11pt', 'font-weight': 'bold' });
    $(ele).find('.dbEdit').show();
}

function saveJumperDatabaseEntry(ele) {

    var jID = $(ele).attr('id');


    $('#jumperlist_sheet').find('li#' + jID).find('.jumpername').text($(ele).find('.jumperNameEdit').val());

    $('#manifest_sheet_container').find('li#' + jID).find('.jumpername').text($(ele).find('.jumperNameEdit').val());

    $(ele).find('.jumpername').text($(ele).find('.jumperNameEdit').val());
    $(ele).find('.jumperFirst').text($(ele).find('.jumperFirstEdit').val());
    $(ele).find('.jumperLast').text($(ele).find('.jumperLastEdit').val());
    $(ele).find('.jumperFaiLic').text($(ele).find('.jumperFaiLicEdit').val());
    $(ele).find('.jumperFaiNation').text($(ele).find('.jumperFaiNationEdit').val());

    cleanJumperDatabaseEdit(ele);
    //activateJumperDatabaseEdit();
    setTimeout("save_data();", 200);
}

function cleanJumperDatabaseEdit(ele) {
    $(ele).css('background-color', '');
    $(ele).find('.jumpername').css({ 'font-size': '8pt', 'font-weight': 'normal' });
    $(ele).find('.dbEdit').remove();
}

function appendJumperList(ele, lidata) {
    $(ele).append('<ol class="jumperlist_group jumpGroup">' + lidata + '</ol>');
}

