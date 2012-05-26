// Basic Security Levels
// admin - all of the above
// management - most everything except techincal confusing stuff, nobody wants to fix or redo.
// captain - group captains, thinking setting up individual access per sheet
// display - squat, nothing

function startControlBar() {
  resetButtons();
  activateButtons();
  draggableControlBar();
}

function draggableControlBar() {
  $('#divControlBar').draggable({ handle: ".handleBar" });
}

function resetButtons() {
    $("#new_sheet").unbind('click').hide();
    $("#clean_manifest_data").unbind('click').hide();
    $("#clean_data").unbind('click').hide();
    $("#fetch_data").unbind('click').hide();

    $("#print_names").unbind('click').hide();
    $("#print_manifest").unbind('click').hide();
    $("#print_manifest_all").unbind('click').hide();
    $("#print_manifest_all_sdaz").unbind('click').hide();
    $("#print_manifest_clipboard").unbind('click').hide();

    // Save Data
    $("#save_data").unbind('click').hide();

    // Documentation Window
    $("#docs").unbind('click').hide();

    $("#check_manifest_duplicates").unbind('click').hide();
    $("#check_database_missing").unbind('click').hide();

    $('#divControlBar').hide();
}

// Assign Static Buttons
function activateButtons() {

  // Display Only Functions
  // hah, Yeah Right..!


  // Management Only Functions
  if (userMode == "admin" || userMode == "management") {

      $("#new_sheet").unbind('click').bind("click", function () {
          if (userMode == "admin" || userMode == "management") {
              loadid = createManifestSheet();
              var mPane = addManifestSheet(loadid);
              routinesManifestSheet(mPane);
              setTimeout("save_data();", 200);
          }
      }).show();

  }

  // Admin Only Function
  if (userMode == "admin") {

    // Wipe Manifest Sheets
    $("#clean_manifest_data").unbind('click').bind("click", function () {
      if (userMode == "admin" && confirm("Are you sure you want to Erase all Manifest Sheets?\n\nThis Cannot be Undone.")) {
        clean_manifest_data();
      }
    }).show();

    // Clean Data
    $("#clean_data").unbind('click').bind("click", function () {
      if (userMode == "admin" && confirm('Are you sure you want to remove ALL data, including jumper names? This Cannot be undone!')) {
        clean_data();
        setTimeout("window.location.reload();", 750);
      }
    }).show();

    // Fetch Data
    $("#fetch_data").unbind('click').bind("click", function () {
      if (userMode == "admin") { fetch_ajax(); }
    }).show();


    $("#print_names").unbind('click').bind("click", function () {
      $(this).printList();
    }).show();
    $("#print_manifest").unbind('click').bind("click", function () {
      $(this).printList('manifest');
    }).show();
    $("#print_manifest_all").unbind('click').bind("click", function () {
      $(this).printManifestAll();
    }).show();
    $("#print_manifest_all_sdaz").unbind('click').bind("click", function () {
      $(this).printManifestAll('AZManifestSheet');
    }).show();
    $("#print_manifest_clipboard").unbind('click').bind("click", function () {
      $(this).printList('clipboard');
    }).show();
  }

  // Captain Only Functions
  if (userMode == "admin" || userMode == "management" || userMode == "captain") {

    // Add new name to Jumpers List  
    $("#newName").keyup(function (event) {
      if ((userMode == "admin" || userMode == "management" || userMode == "captain") && event.keyCode == '13') {
        addNewName($('#newName').val());
      }
    }).show();

    // Save Data
    $("#save_data").unbind('click').bind("click", function () {
      if (userMode == "admin" || userMode == "management" || userMode == "captain") { save_ajax(); }
    }).show();
  
    // Documentation Window
    $("#docs").unbind('click').bind("click", function () {
      window.open('docs.html');
    }).show();

    $("#check_manifest_duplicates").unbind('click').bind('click', function () {
      if (userMode == "admin" || userMode == "management" || userMode == "captain") { checkDuplicates_allSheets(); }
    }).show();

    $("#check_database_missing").unbind('click').bind('click', function () {
      if (userMode == "admin" || userMode == "management" || userMode == "captain") { checkMissing_database(); }
    }).show();

    $('#divControlBar').show();
  } else {
    $('#divControlBar').hide();
  }

}