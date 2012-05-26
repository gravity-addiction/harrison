var engine_rdy;
var jumperlist_html, jumperdb_html, manifest_html, messagelist_html, missingSlotList_html;
var jumperlist_names = [];


var ajax_version, local_version;
var local_update, doVersionCheck;

var jumpersSelected=new Array();
var jumperlists_ids = new Array();
jumperlists_ids[0]="#jumperlist_sheet";
//jumperlists_ids[1]="#jumperdatabase_sheet";

ajax_version = 0;
local_version = 0;

doVersionCheck = 1; // Does a Delayed Reconnect to the server for updates
defaultVersionCheck = 10000; // Milli seconds between version checks
currentVersionCheck = defaultVersionCheck; // Current version (program set)

majorErrorCnt = 0; // Bool for major error display


$.extend($.jStore.defaults, { 
  project: 'dzmanifest', 
  engine: 'local', 
  //flash: 'jStore.Flash.html' 
});


// JSTORE READY ENGINE
$.jStore.ready(function(engine){
  //$.jStore.flashReady(function(){
    engine.ready(function(){
      engine_rdy = this; // Assign jStore object to global variable
      fetch_data(); // Grab data from DOM
      //fetch_ajax(); // Grab ajax for startup
    }) 
  //})  
});


function updateCurrentTime() {
  var d = new Date();
  var dHr = d.getHours();
  var dMin = d.getMinutes();
  var dAP = "";
  
  if (dHr > 12) { dHr-=12; dAP = "PM"; } else { dAP = "AM"; }
  if (dMin<10) { dMin = "0"+dMin; }
  
  $('#currentTime').text('Time: '+dHr+':'+dMin+' '+dAP);
  setTimeout("updateCurrentTime();",15000);
}



// Document Ready
$(document).ready(function() {
  updateCurrentTime();
  
  
  $.jStore.load();

  // New Messages - Needs Development Still
  //activateNewMessageList();
});




// Initalize Manifest Program (Run Once)
function manifestStartup() {
  // Fixed Controllers
  startupClipboard(); // manifest_clipboard.js
  startControlBar(); // manifest_controlBar.js


  // Manifest Sheets
  list_manifestsheets();


  // Run Jumper and Manifest Routines
  //routinesJumpers();
  routinesManifestSheet();


  // Disable Selection
  doSelectDisable();

  // Startup Version Checking
  loopVersionCheck();

  // Autocomplete
  compile_jumperlist_names();
  activateAutoComplete();
}



// Manifest Routines 
function routinesManifestSheet() {
  var argLen = arguments.length
  var mPaneList = [];
  if (argLen > 0) {
    for (var i=0; i<argLen; i++) {
      mPaneList.push(arguments[i]);
    }
  } else {
    $('.manifest_pane').each(function() {
      mPaneList.push($(this));
    });
  }

  var mpLen = mPaneList.length;
  if (mpLen > 0) {
    for (var mP=0; mP<mpLen; mP++) {

      var mPane = mPaneList[mP];

      updateManifestSheetCount(mPane);
      
      makeManifestRightNumberClick(mPane);
      
      makeManifestListsSortable(mPane);
      
      makeManifestDroppable(mPane);
      makeManifestSortable(mPane);
      makeManifestClickable(mPane);
      
      makeManifestSheetButtons(mPane);

      activateManifestSheet(mPane);

      routinesJumpers(mPane);
      //makeJumpersRemovable(mPane)

      //makeManifestSheetButtons($("#load_"+loadid).find(".manifest_sheet_controls"),tLoadID);

    }
  }

}


// Jumper Routines
function routinesJumpers() {
  var argLen = arguments.length
  
  if (argLen > 0) {
    for (var i=0; i<argLen; i++) {

      // Jumper Routines
      makeJumpersListHeaderButtons();
      makeJumpersDraggable(arguments[i]);
      makeJumpersRemovable(arguments[i]);
      makeJumpersSortable(arguments[i]);
      makeJumpersDroppable(arguments[i]);
      makeJumpersClickable(arguments[i]);
      makeJumpersEditable(arguments[i]);
  
    }
  } else {

    // Jumper Routines
    makeJumpersListHeaderButtons();
    makeJumpersDraggable();
    makeJumpersRemovable();
    makeJumpersSortable();
    makeJumpersDroppable();
    makeJumpersClickable();
    makeJumpersEditable();
  
  }
  
}



// Setup Single Manifest Load Sheet
function setupLoadSheet(ele) {
  var tElePane;
  var tEleMs
  var tLoadID;
  
  tElePane = findManifestPane(ele);
    
  if (!!tElePane) {
    tEleMs = $(ele).find('#manifest_pane');
    tLoadID = tEleMs.attr('id').substring(6);
    
    moveManifestSheetBlankSlots(tElePane);
    routinesManifestSheet(tElePane);
/*
    makeManifestSheetButtons($("#load_"+loadid).find(".manifest_sheet_controls"),tLoadID);
    makeManifestDroppable(tElePane);
    makeManifestSortable(tElePane);
    makeManifestClickable(tElePane);
    */
  }
}

// Locate TL Manifest Pane Node
function findManifestPane(ele) {
  var tElePane;
  
  if ($(ele).hasClass('manifest_pane')) {
    tElePane = $(ele);
  } else {
    tElePane = $(ele).closest('li.manifest_pane');
  }
return tElePane; 
}





function activateManifestSheet(ele) {
  

    // Double Click Load ID Change
    $(ele).find(".manifest_header").unbind("dblclick").bind("dblclick", function() {
      var userprompt = prompt("Change Load Name",$(this).find(".loadinformation").text());
        if (userprompt==null) {
      	  return;
        } else {
        	if (userprompt=='') { userprompt = '-'; }
        
          $(this).find(".loadinformation").html("<b>"+userprompt+"</b>"); // Change Manifest Sheet
        
          setTimeout("save_data();",200); // Save Changes
        
        }
    });
    
    // Double Click Plane Number Change
    $(ele).find(".planeNumberButton").each(function() {
      $(this).unbind("dblclick").bind("dblclick", function() {
        var userprompt = prompt("Plane Number",$(this).find(".planeNumber").text());
        if (userprompt==null) {
      	  return;
        } else {
        	if (userprompt.replace(/\s/g, "") == '') { userprompt = '&nbsp;'; }
        
          $(this).find(".planeNumber").html(userprompt); // Change Manifest Sheet
        
          setTimeout("save_data();",200); // Save Changes
        
        }
      });
    });
    
    // Double Click Plane Altitude Change
    $(ele).find(".planeAltitudeButton").each(function() {
      $(this).unbind("dblclick").bind("dblclick", function() {
        var userprompt = prompt("Altitude",$(this).find(".planeAltitude").text());
        if (userprompt==null) {
      	  return;
        } else {
        	if (userprompt.replace(/\s/g, "") == '') { userprompt = '&nbsp;'; }
        
          $(this).find(".planeAltitude").html(userprompt); // Change Manifest Sheet
        
          setTimeout("save_data();",200); // Save Changes
        
        }
      });
    });
     
}















// COMPILE VARIOUS LISTS

// Sets manifest_html
function compile_manifest_html() {

  manifest_html = new Array();
  $("#manifest_sheet_container").find(".manifest_pane").each(function(i) {
    manifest_html[i] = $(this).html();
  });

return;
}

// Returns list of database jumpers
function compile_jumpers_db() {
  var tmpjumpers = new Array();
  
  $("#jumpers_box").find("#jumperdatabase_sheet ol").each(function(i) {
    tmpjumpers[$(this).find("li").attr("id")]=$(this).find("li").text();
  });
return tmpjumpers;
}


// Returns list of clipboard jumpers
function compile_jumpers_list() {
  var tmpjumpers = new Array();
  
  $("#jumpers_box").find("#jumperlist_sheet ol").each(function(i) {
    tmpjumpers[i]=$(this).find("li").attr("id");
  });
return tmpjumpers;	
}

function compile_jumperlist_names() {
  jumperlist_names = [];
  $("#jumperdatabase_sheet").find("ol > .jumpSlot").each(function() {
    jumperlist_names.push({id: $(this).attr('id'), label: $(this).find('.jumpername').text(), real: $(this).find('.jumperFirst').text()+' '+$(this).find('.jumperLast').text()});
  });
}















// MANIFEST SHEET FUNCTIONS
function clean_manifest_data() {
  
  for (i in manifest_loadid) {
    unloadManifestSheet(manifest_loadid[i]);
  }
  

  engine_rdy.rem('manifest_html');
  
  manifest_html = new Array();
  
  $("#manifest_sheet_container").html('');
  
  
  setTimeout("save_data();",200);
}





function save_data() {
  //save_ajax();
  save_local();
  compile_jumperlist_names();
}
function save_local() {

  if ($("#manifest_sheet_container").attr('class').search(/manifest_admin/gi) == -1) { return; }

  if (engine_rdy==null) {
    alert("Cannot Save, Engine Not Ready or Available");
    return;	
  }

  local_update = 1;
  
  removeHighlights();

  compile_manifest_html();

  console.log("Saving");

  engine_rdy.set('jumperlist_html', $("#jumperlist_sheet").html());

  engine_rdy.set('jumperdb_html', $("#jumperdatabase_sheet").html());
    
  engine_rdy.set('manifest_html', $.toJSON(manifest_html));

  engine_rdy.set('messagelist_html', $("#messageList_box").html());
  
  engine_rdy.set('version', $.toJSON(local_version));

  engine_rdy.set('updateWoSave', $.toJSON(local_update));
  
return;
}

function save_ajax() {

  if ($("#manifest_sheet_container").attr('class').search(/manifest_admin/gi) == -1) { return; }

  removeHighlights();
  compile_manifest_html();

    saveData = {
      'direction' : 'SAVE',
      'jumperlist_html' : $.toJSON($("#jumperlist_sheet").html()),
      'jumperdb_html' : $.toJSON($("#jumperdatabase_sheet").html()),
      'manifest_html' : $.toJSON(manifest_html),
      'messagelist_html' : $.toJSON($("#messageList_box").html()),
      'version' : local_version
    };

  if (arguments.length > 0 && arguments[0] == "doAnyway") saveData['doAnyway'] = '1';

  $('body').css('cursor','wait');
  $('#save_data').css('cursor','wait');

  $.ajax({
    url: ajaxUrl,
    cache: false,
    dataType: 'xml',
    type: 'post',
    data: saveData,
    success: function(xmlData) {
      if ($(xmlData).find('status').text()=='Success') {
        local_version = $(xmlData).find('version').text();
        engine_rdy.set('version', $.toJSON(local_version));
        local_update = 0;
        engine_rdy.set('updateWoSave', $.toJSON(local_update));
        doVersionCheck = 1;
      } else {
        if (confirm("Manifest Versions do not match.\n\nOverwrite Server Anyways?")) {
          save_ajax("doAnyway");
        } else {
          doVersionCheck = 0;
        }
      }
    },
    complete: function (xmlStatus, txtStatus) {
      $('body').css('cursor','');
      $('#save_data').css('cursor','pointer');
    }
  });
}




function clean_ajax() {
  $.ajax({
    url: ajaxUrl,
    cache: false,
    dataType: 'text',
    type: 'post',
    data: {
      'direction' : 'CLEAN'
    },
    success: function(textData) {
      
    },
    complete: function (xmlStatus, txtStatus) {

    }
  }); 
}


function fetch_data() {
  fetch_local();
  compile_jumperlist_names();
  //fetch_ajax();
}
function fetch_local() {

  // For DOM Only
  if (engine_rdy==null) {
    alert("Cannot Fetch Data, Engine Not Ready or Available");
    return;	
  }

  try{
    var tmpjumperlist_html = engine_rdy.get("jumperlist_html");
    if (!!tmpjumperlist_html) { jumperlist_html = tmpjumperlist_html; delete tmpjumperlist_html; }
  } catch(c) { }
  
  try{
    var tmpjumperdb_html = engine_rdy.get("jumperdb_html");
    if (!!tmpjumperdb_html) { jumperdb_html = tmpjumperdb_html; delete tmpjumperdb_html; }
  } catch(c) { }

  try{
    var tmpmanifest_html = engine_rdy.get("manifest_html");
    if (!!tmpmanifest_html) { manifest_html = $.evalJSON(tmpmanifest_html); delete tmpmanifest_html; }
  } catch(c) { }
  
  try{
    var tmpmessagelist_html = engine_rdy.get("messagelist_html");
    if (!!tmpmessagelist_html) { messagelist_html = tmpmessagelist_html; delete tmpmessagelist_html; }
  } catch(c) { }
  
  try{
    var tmpversion = engine_rdy.get('version');
    if (!!tmpversion) { local_version = $.evalJSON(tmpversion); delete tmpversion; }
  } catch(c) { }
  
  try{
    var tmpupdateWoSave = engine_rdy.get('updateWoSave');
    if (!!tmpversion) { local_update = $.evalJSON(tmpupdateWoSave); delete tmpupdateWoSave; }
  } catch(c) { }

  manifestStartup();
}


function fetch_ajax() {
  
  var doLocalSave = 0;
  if (arguments.length > 0 && arguments[0] == "doSave") {
    doLocalSave = 1;
  }

  $.ajax({
    url: ajaxUrl,
    cache: false,
    dataType: 'xml',
    type: 'post',
    data: {
      'direction' : 'GET'
    },
    success: function(xmlData) {

      ajax_version = $.evalJSON($(xmlData).find('version').text());

      if (ajax_version!=local_version || local_update == 1) {

          try { jumperlist_html = $.evalJSON($(xmlData).find('jumperlist_html').text()); } catch(e) { }
          try { jumperdb_html = $.evalJSON($(xmlData).find('jumperdb_html').text()); } catch(e) { }
          try { manifest_html = $.evalJSON($(xmlData).find('manifest_html').text()); } catch(e) { }
          try { messagelist_html = $.evalJSON($(xmlData).find('messagelist_html').text()); } catch(e) { }

          local_version = $(xmlData).find('version').text();
          local_update = 0;
          
          doVersionCheck = 1;

          manifestStartup();
          if (doLocalSave = 1) { doLocalSave = 0; setTimeout("save_data();",750); }
          //fetch_data();
          
      } else {

        manifestStartup();

      }    


    },
    complete: function (xmlStatus, txtStatus) {
      if (txtStatus!='success') {
        //fetch_data();
        //manifestStartup();
      }
    }
  });
  
  return;
}


















var blankSlot_html = '<li id="blankSlot" class="jumpSlot"><div class="left_number"></div><div class="right_number"></div><div class="jumpername">&nbsp;</div></li>'

var jumperGroup_html = '<ol class="manifest_group jumpGroup">'+blankSlot_html+'</ol>';


function list_manifestsheets() {
  $('#manifest_sheet_container').html('');
  if (manifest_html.length>0) {
    for (loadid in manifest_html) {
      addManifestSheet(loadid);
    }	
  }
}


function createManifestSheet() {
  // Grab next ID
  var loadid = manifest_html.length; // Current Load Id, next element in array to do this
  var seatCount = 0;
  var sheetHeadline = "Airplane Go Skydiving.. Yay";

  sheetHeadline = prompt('Headline: ');
  if (!!arguments.length == 0)
    seatCount = prompt('Slots: ');
  
  var entryHtml = '';
  entryHtml = entryHtml + '<div class="manifest_header">';
  
    //entryHtml = entryHtml + '<div style="float: right;"><span class="timerinfo" id="timer"></span></div>';
    entryHtml = entryHtml + '<div style="float: right;"><span class="removesheet">X</span></div>';
  
    //entryHtml = entryHtml + '<span class="loadinformation"><b><span id="loadid">'+manifest_loadid[manifest_loads[loadid]]+'</span> - '+fetchAirplaneName(planeid)+'</b></span>';
    entryHtml = entryHtml + '<span class="loadinformation"><b>'+sheetHeadline+'</b></span>';
  
  entryHtml = entryHtml + '</div>';
  
  entryHtml = entryHtml + '<div class="manifest_header manifest_sheet_controls"><span class="printsheet" style="cursor:pointer;">[&nbsp;&nbsp;Print&nbsp;&nbsp;]</span>&nbsp;&nbsp;<span class="addslot" style="cursor:pointer;">[&nbsp;&nbsp;Add Slot&nbsp;&nbsp;]</span>&nbsp;&nbsp;<span class="copysheet" style="cursor:pointer;">[&nbsp;&nbsp;Copy&nbsp;&nbsp;]</span></div>';
  
  entryHtml = entryHtml + '<div class="manifest_sheet">';
  
  // Add Blank Slots into Manifest Sheet
  for (i=0;i<seatCount;i++) {
    entryHtml = entryHtml + jumperGroup_html;
  }
  
  entryHtml = entryHtml + '</div>';
  
  entryHtml = entryHtml + '<div class="manifest_footer"><span class="planeNumberButton" style="cursor:pointer;">Plane : <b><span class="planeNumber">&nbsp;</span></b></span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="planeAltitudeButton" style="cursor:pointer;">Alt : <b><span class="planeAltitude">&nbsp;</span></b></span></div>';
  
  manifest_html[loadid] = entryHtml;
  
return loadid;
}


function addManifestSheet(loadid) {
  /* Adjust Width based in # of Manifest Sheets
  var paneCnt = $("#manifest_sheet_container > .manifest_pane").length;
  if (!!paneCnt && paneCnt.replace(/[^0-9]/g,"") != "")
    $("#manifest_sheet_container").css("width",(paneCnt*236)+"px");
  else
    $("#manifest_sheet_container").css("width","100%");
  */
  
  var newSheet = $('<li class="manifest_pane" id="load_'+loadid+'"></li>').html(manifest_html[loadid]);
  
  newSheet = updateManifestSheetCount(newSheet);
  
  $("#manifest_sheet_container").append(newSheet);
  
return newSheet;
}


function addManifestSheetLoadGroup(ele) {
  $(ele).append(jumperGroup_html);
}

function unloadManifestSheet(loadid) {
  $("#manifest_sheet_container").find("#"+loadid).find('ol').each(function() {
    if ($(this).find('li').attr('id')!='blankSlot') {
      
      jumperName = $(this).find(".jumpername").text().replace(/(<([^>]+)>)/ig,"");
      
      addJumperListName($("#jumperlist_sheet"),$(this).find('li[class="jumpSlot"]').attr('id'),jumperName)
      
    }
  });
}

function removeManifestSheet(loadid) {
	
  $("#manifest_sheet_container").find("#"+loadid).remove(); // Remove Frame
  var numLoadid = loadid.replace(/[^0-9]/g,"");

  if (!!manifest_html[numLoadid])
    delete manifest_html[numLoadid];

}


// Remove Blank 
function removeManifestSheetBlankSlots(ele,cnt) {
  removeCount = 0;
  while (removeCount<cnt) {
    $(ele).find('li[id="blankSlot"]').last().parent().remove();
    removeCount++;
  }
}

    // Move Blank Slots to Bottom Of List
    function moveManifestSheetBlankSlots(ele) {
      return;
      var oldata = '';
      
      $(ele).find("ol").each(function (i) {
        $(this).find("li[id='blankSlot']").each(function (lii) {
          if ($(this).parent().find("li").length==1) { // Sopposed to, otherwise a blank one got inside a group
	  	    $(ele).append('<ol class="manifest_group">'+$(this).parent().html()+'</ol>');
	  	    $(this).parent().remove();
	  	  }
        });
      });
    }
    
    // Reset Numbers on Manifest Sheets
	function updateManifestSheetCount(ele) {
	
	/*
	  // Count Entire Manifest
	  cnt = 1;
	  $('div[id="manifest_sheet_container"]').find("li.jumpSlot").each(function() {
        $(this).find("div.left_number").html(cnt);
        cnt = cnt + 1;
      });
    */
    
      // Count Each Sheet Individually
      $(ele).find("ol").each(function (i) {
        $(this).attr("id","group"+(i+1));
	  });

	  seatCount = $(ele).find("li").length;
	  $(ele).find("li").each(function (i) {
	    //$(this).find("div.right_number").html(seatCount-i);
	    $(this).find("div.left_number").html(i+1);
	  });	  
	  
	return ele;
	}
    
    




    // Manifest Sheet Buttons
    function makeManifestSheetButtons(ele) {
      var isFueling=0;
      var tElePane = findManifestPane(ele);
      
      $(tElePane).find("span[class='removesheet']").each(function() {
        $(this).unbind("dblclick").bind("dblclick", function() {
          if (confirm('Move All Jumpers To Clipboard?')) {
            var unPane = findManifestPane($(this));
            unloadManifestSheet(unPane.attr('id'));
          }
          if (confirm('Remove Manifest Sheet?')) {
            var remPane = findManifestPane($(this));
            removeManifestSheet(remPane.attr('id'));
          }
          setTimeout("save_data();",250);
        });
      });
      
      $(tElePane).find("span[class='printsheet']").each(function() {
        $(this).unbind("dblclick").bind("dblclick", function() {
          $(this).parent().parent().printArea();
        });
      });
      
      $(tElePane).find("span[class='addslot']").each(function() {
        $(this).unbind("dblclick").bind("dblclick", function() {
          
          var tElePane = findManifestPane(ele);
          addManifestSheetLoadGroup($(tElePane).find(".manifest_sheet"));
    //      addManifestSheetLoadGroup($(this).parent().find('.manifest_sheet'));
          routinesManifestSheet(tElePane);
        });
        setTimeout("save_data();",250);
      });


      // Copy Load
      $(tElePane).find("span[class='copysheet']").each(function() {
        $(this).unbind("dblclick").bind("dblclick",function() {
          var curManifest = findManifestPane($(this));
          var loadid = curManifest.attr('id').replace(/[^0-9]/g,"");
          
          var newloadid = createManifestSheet('SkipSlots')

          if (!!manifest_html[newloadid]) {
            // Fetch New sheet headline
            var newloadHeader = $(manifest_html[newloadid]).find(".loadinformation").html();
            manifest_html[newloadid] = manifest_html[loadid];
            
            // Add sheet to page
            var nEle = addManifestSheet(newloadid);
            
            // Update Sheet with new user input headline
            var tElePane = findManifestPane(nEle);
            $(tElePane).find(".loadinformation").html(newloadHeader);

            routinesManifestSheet(tElePane);

            setTimeout("save_data();",250);
          }
          
        });
      });


      /*

      // Send Load
      $(ele).find(".sendload").unbind("dblclick").bind("dblclick",function() {
        alert("Sending Load");
        setTimeout("save_data();",200);
      });
      
      // Copy Load
      $(ele).find(".copysheet").unbind("dblclick").bind("dblclick",function() {
        var newloadid;
        newloadid = createManifestSheet(manifest_plane[i]);
        if (newloadid!=false) {
          addManifestSheet(manifest_plane[i],newloadid);
        }
        $("#load_"+manifest_loads[newloadid]).find(".manifest_sheet").html($("#load_"+manifest_loads[loadid]).find(".manifest_sheet").html());
        
      });


  /*
      // Print Sheet
      $(ele).find(".print").unbind("click");
      $(ele).find(".print").bind("click",function() {
      	$(this).parent().parent().printArea();
        //alert("Print");	
      });
      
      // Fuel
      $(ele).find(".fuel").toggle(function() {
      	$(this).css('background-color','green');
      	setTimeout("save_data();",200);
      }, function() {
      	$(this).css('background-color','');
      	setTimeout("save_data();",200);
      });
      

      $(ele).find(".shutdown").unbind("click");
      $(ele).find(".shutdown").bind("click",function() {
        if ($("#load_"+manifest_loads[loadid]).find("#timer").text()=='SHUTDOWN') {
          var timeTillLaunch = promptManifestSheetTimer(loadid);
          if (timeTillLaunch!=null && timeTillLaunch!=false) {
            updateManifestSheetTimer(loadid,timeTillLaunch);
            changeManifestSheetTimer(loadid);
          }
        } else {
          updateLoadTime(loadid,'SHUTDOWN');
          $("#load_"+manifest_loads[loadid]).find(".manifest_header").css("background-color","red");
        }
        setTimeout("save_data();",200);
      });
*/
    }
    
    
    


    function makeJumpersListHeaderButtons() {
       $('#jumpershowclipboard').unbind('click').bind('click',function() {
            $('#jumperdatabase_sheet').hide();
            $('#jumperlist_sheet').show();
            $('#jumpershowclipboard').css({'color':'#000','font-weight':'bold','text-decoration':'none'});
            $('#jumpershowdb').css({'color':'#66F','font-weight':'normal','text-decoration':'underline'});
        });
        $('#jumpershowdb').unbind('click').bind('click',function() {
            $('#jumperlist_sheet').hide();
            $('#jumperdatabase_sheet').show();
            $('#jumpershowclipboard').css({'color':'#66F','font-weight':'normal','text-decoration':'underline'});
            $('#jumpershowdb').css({'color':'#000','font-weight':'bold','text-decoration':'none'});
        });
    }
        

    function makeJumpersDraggable() {
       // Make Jumper List Draggable, Disable Selection
      for (i in jumperlists_ids) {
        $(".jumperlist_pane").find(jumperlists_ids[i]+" ol").draggable({
          helper: 'clone',
          appendTo: 'body',
          revert: false,
          stop: function(event, ui) { setTimeout("save_data();",750); },
          //scrollSpeed: 100,
          zindex: 5200,
        });
      }
      
    }
    
    function makeJumpersSortable() {
    	for (i in jumperlists_ids) {
        $(".jumperlist_pane").find(jumperlists_ids[i]).sortable({
          helper: 'clone',
          appendTo: 'body',
          revert: true,
          scrollSpeed: 100,
          containment: 'parent',
          stop: function(event, ui) { setTimeout("save_data();",200);  },
        });
    	}
    }
    function makeJumpersClickable() {
    	$("#jumperlist_sheet ol").each(function(i) {
    	  /* dbl click remove of jumpers in clip board */
    	  $(this).unbind("dblclick").bind("dblclick",function() {
    	    if (confirm('Are you sure you want to remove, '+$(this).find('.jumpername').html().replace(/(<([^>]+)>)/ig,""))) {
              var loadid = $(this).closest('.manifest_pane').attr('id');
    	  	  $(this).remove();
              // SETUPJUMPERS
              routinesManifestSheet($("#"+loadid));
              setTimeout("save_data();",250);
    	    }
    	  });
    	});

      $("#jumperdatabase_sheet ol").each(function(i) {
    	  /* dbl click remove of jumpers in database */
    	  $(this).unbind("dblclick").bind("dblclick",function() {
     	      if ($('#jumperlist_sheet').find('li#'+$(this).find('li').attr('id')).length > 0) {
    	  	    alert("Jumper On Clipboard, Must Remove First");
    	  	    return; 
    	  	  }
    	  	  if ($('#manifest_sheet_container').find('li#'+$(this).find('li').eq(0).attr('id')).length > 0) {
    	  	    alert("Jumper On Airplane Load, Must Remove First");
    	  	    return; 
    	  	  }  
    	    
    	    if (confirm('Are you sure you want to remove, '+$(this).find('.jumpername').html().replace(/(<([^>]+)>)/ig,""))) {
              var loadid = $(this).closest('.manifest_pane').attr('id');
    	  	  $(this).remove();
              // SETUPJUMPERS
              routinesManifestSheet($("#"+loadid));
              setTimeout("save_data();",250);
    	    }
    	  });
    	});

      activateJumperDatabaseEdit();    	
    }
    
    
    function makeJumpersRemovable() {
      $('#manifest_sheet_container').find("li.jumpSlot").each(function (i) {
        
        if ($(this).attr('id')=='blankSlot') {
          // Remove Blank Slots
          $(this).unbind("dblclick").bind("dblclick",function(e) {
            return true;
            
            if (confirm("Remove Blank Slot?")) {
              loadid = $(this).closest('.manifest_pane').attr("id");

              $(this).parent().remove();
            
              //if (left_number != last_number) {
              if (!e.shiftKey) {
                addManifestSheetLoadGroup($("#"+loadid).find(".manifest_sheet"));
              }
       
              // SETUPJUMPERS
              routinesManifestSheet($("#"+loadid));
              setTimeout("save_data();",250);
            }
          });
        }
        
        $(this).find('.jumpername').unbind("dblclick").bind("dblclick",function() {

          loadid = $(this).closest('.manifest_pane').attr("id");
          i = $(this).parent().attr("id");

          if ($(this).parent().parent().find("li").attr('id')!='blankSlot') {
            slotRightNumber = $(this).parent().find(".right_number").text();
            jumperName = $(this).text().replace(/(<([^>]+)>)/ig,"");
            addJumperListName($("#jumperlist_sheet"),i,jumperName)
      
            myBlankSlot = $(blankSlot_html);
            myBlankSlot.find(".right_number").text(slotRightNumber);
            $(this).parent().parent().html(myBlankSlot);
          
          }
          
          // SETUPJUMPERS
          routinesManifestSheet($("#"+loadid));
          setTimeout("save_data();",250);
        });
      });
    }
   
    function makeJumpersEditable() {
      $("li.jumpSlot").each(function (i) {
        if ($(this).attr('id') == 'blankSlot') {
          // No Jumper In Slot

        } else {
          // Has Jumper in Slot
          $(this).unbind("contextmenu").bind("contextmenu",function(e) {
            //e.preventDefault();
            //alert("Right Click");
            console.log('EDIT JUMPER');
          });
        }
      });
    }
       
    function makeJumpersDroppable() {
        $(".jumperlist_pane").droppable({
          accept: '.manifest_pane > .manifest_group',
          tolerance: 'pointer',
          drop: function(event,ui) {

          	var loadid = $(ui.helper).parent().parent().attr("id");
          	var groupid = $(ui.helper).attr("id");
          	var onLoadAlready='';
          	
          	if ($(ui.helper).find("li").length<=0) { return; }
          	
          	if ($(ui.helper).find("li").length>1) {
            	var lidata='';
            	$(ui.helper).find("li").each(function (i) {
            		lidata+='<li id="'+$(this).attr("id")+'" class="jumpSlot"><div class="left_number"></div><div class="right_number"></div><div class="jumpername">'+$(this).find(".jumpername").text()+'</div></li>';
                // Add Removed Seats
                //addManifestSheetLoadGroup($(".manifest_pane[id="+loadid+"]").find(".manifest_sheet"));
            	});
          	} else {
          		$("#jumperlist_sheet").find("ol").each(function(i) {
          			if ($(this).find("li").length==1) {
              		if ($(ui.helper).find("li").attr("id")==$(this).find("li").attr("id")) {
              		  alert("Jumper already On List as Individual");
          	    	  onLoadAlready='1'	
          		    }
          			}
          		});
          		
          		var lidata='<li id="'+$(ui.helper).find("li").attr("id")+'" class="jumpSlot"><div class="left_number"></div><div class="right_number"></div><div class="jumpername">'+$(ui.helper).find("li").find(".jumpername").text()+'</div></li>';          		      		
          	}
            if (onLoadAlready=='') {
          	  appendJumperList($("#jumperlist_sheet"),lidata);
          	  // SETUPJUMPERS
              routinesManifestSheet($("#"+loadid));
              setTimeout("save_data();",250);
            }
          	// Remove Group
          	//$(".manifest_pane[id="+loadid+"]").find(".manifest_sheet ol[id="+groupid+"]").remove();
          	  
          }
        });
    }

    

















    var rightNumber_editing = 0;
    
    function makeManifestNumberClick() {
        $("#manifest_sheet_container").find(".manifest_sheet").find(".jumpSlot").each(function (i) {
          bindManifestRightNumber(this);
          
          $(this).find("div.left_number").toggle(function() {
            $(this).parent().css("background-color","yellow");
           }, function() {
          	delete jumpersSelected[$(this).attr("id")];
        	  $(this).parent().css("background-color","red");
           }, function() {
            delete jumpersSelected[$(this).attr("id")];
        	  $(this).parent().css("background-color","");
          });
        }); 
    }

    function makeManifestRightNumberClick() {
      if ($("#manifest_sheet_container").attr('class').search(/manifest_admin/gi)>=0) {
        $("#manifest_sheet_container").find(".manifest_sheet").find(".jumpSlot").each(function (i) {
          bindManifestRightNumber(this);
        }); 
      }
    }

    function bindManifestRightNumber(ele) {
      $(ele).find('div[class="right_number"]').unbind("click").bind('click',function() {

        if (rightNumber_editing==1) {
          saveManifestRightNumber();
        }
        if (jumperName_Editing==1) {
          saveManifestJumper()
        }

        changeManifestRightNumber(this);
   
      });
    }
    
    function changeManifestRightNumber(ele) {
      var cval = $(ele).html();
      $('#inp_rightnumber').each(function() { $(this).replaceWith("&nbsp;"); });
      $(ele).html('<input type="text" id="inp_rightnumber" name="inp_rightnumber" style="position:relative;top:-2;margin:0;padding:0;width:60px;border:0;background-color:transparent;text-align:right;" size="6" value="'+cval+'" />');
      
      $('input[name="inp_rightnumber"]').unbind('blur').bind('blur',function() {
        saveManifestRightNumber();
      });
            
      $('input[name="inp_rightnumber"]').focus();
      $('input[name="inp_rightnumber"]').unbind('keyup').bind('keyup',function(e) {
        if (e.which==13) {
          saveManifestRightNumber();
        }
      });
      rightNumber_editing = 1;
      
    }
    
    function saveManifestRightNumber() {
      $('input[name="inp_rightnumber"]').unbind('blur');
      
      newVal = $('input[name="inp_rightnumber"]').val();

      $('input[name="inp_rightnumber"]').parent().html($('input[name="inp_rightnumber"]').val());
      bindManifestRightNumber($('input[name="inp_rightnumber"]').parent());
      rightNumber_editing = 0;

      checkManifestRightNumbers();
      setTimeout("save_data();",250);
    }

    function checkManifestRightNumbers() {
      var mContainer = $("#manifest_sheet_container");
      var mContLen = mContainer.find(".jumpSlot").length;
      var mFound = 0;
      var mMissingList = "";
      for (var i = 1; i <= mContLen; i++) {
        var sI = new String(i);
        mFound = 0;

        // Check for Missing, Count for Duplicates
        mContainer.find(".right_number").each(function() {
          if ($(this).text() == sI) { mFound++; }
        });
        if (mFound == 0) { if (mMissingList != '') mMissingList += ', '; mMissingList += i; }

        // Check for Duplicates
        mContainer.find(".right_number").each(function() {
          if ($(this).text() == sI && mFound == 1) { $(this).css('background-color',''); }
          if ($(this).text() == sI && mFound > 2) { $(this).css('background-color','#fcc'); }
        });
        
      }
      missingSlotList_html = mMissingList;
      console.log("Missing: "+missingSlotList_html);

    }
    
    
    
    function makeManifestClickable(ele) {
      $(ele).find(".jumpSlot").each(function() {
        bindManifestJumper(this);
      });
    }

    function bindManifestJumper(ele) {
      $(ele).find('.jumpername').unbind("click").bind('click',function() {
        
        if ($(this).parent().attr('id') == "blankSlot") {
          if (rightNumber_editing==1) {
            saveManifestRightNumber();
            rightNumber_editing = 0;
          }
          if (jumperName_Editing==1) {
            saveManifestJumper();
            jumperName_Editing = 0;
          }
          changeManifestJumper(this);
        }
      });
    }

    var jumperName_Editing = 0;

    function changeManifestJumper(ele) {
      var cval = $(ele).html();
      $('#inp_jumpername').each(function() { $(this).replaceWith("&nbsp;"); });

      $(ele).html('<input type="text" id="inp_jumpername" name="inp_jumpername" style="position:relative;top:-2;width:140px;margin:0;border:0;background-color:transparent;text-align:left;" size="20" value="'+cval+'" />');

            
      $('input[name="inp_jumpername"]').focus();
      $('input[name="inp_jumpername"]').bind('keyup',function(e) {
        if (e.which==13) {
          saveManifestJumper();
        }
      });
      
      console.log("GO");
      activateAutoComplete();
      
      jumperName_Editing = 1;
      
    }
    

    function saveManifestJumper() {
      $('input[name="inp_jumpername"]').unbind('blur');
      
      newVal = $('input[name="inp_jumpername"]').val();
      if (newVal.replace(/\s/g,"") == "" || newVal == null) {
        newVal = "&nbsp;";
        jumperid = "blankSlot";
      } else {
        jumperid = generateNewID();
        addJumperDatabase(jumperid,newVal);
      }

      $('input[name="inp_jumpername"]').closest('li').attr('id', jumperid);

      $('input[name="inp_jumpername"]').parent().html(newVal);

      bindManifestJumper($('input[name="inp_jumpername"]').parent());
      jumperName_Editing = 0;
      setTimeout("save_data();",250);

    }










    // Update Sortable Functionality
    function makeManifestSortable(ele) {
        // Make Each Manifest Sheet Sortable, Disable Selection
        $(ele).find(".manifest_sheet").sortable({ 
          //revert: true,
          update: function(event, ui) { moveManifestSheetBlankSlots(this);updateManifestSheetCount(this); },
          stop: function (event, ui) {
            setTimeout("save_data();",200);
          },
          delay: 350,
          scrollSpeed: 100
        });
    }

    // Update Droppable Functionality
    function makeManifestDroppable(ele) {
        // Make each ol Group Droppable, Holds most of the brains for moving persons from one list to another
        $(ele).find(".manifest_sheet ol").droppable({
          //accept: '.manifest_group, jumperlist_group',
          accept: '.jumperlist_group',
          tolerance: 'pointer',
          drop: function(event,ui) {
            $(ui.helper).find(".jumpSlot > .right_number").text($(this).find(".jumpSlot > .right_number").text());

          	// Do Not Drop On Self
          	if ($(ui.helper).parent().parent().attr("id")==$(this).parent().parent().attr("id")) {
          	  return;
          	}
          	
          	// Do Not Let Load Sheets Drop into another Manifest Sheet
          	if (!!$(ui.helper).attr("id") && $(ui.helper).attr("id").substr(0,4)=='load') {
          	  return;
          	}

            
/*            
            // Try not to Duplicate Jumpers
            if ($(ui.helper).find("li").length>1) {
              var groupLink = $(this);
              
              var tmpAlert=0;
              var tmpJumperList='';
              // Moving Group, Pull Jumpers from Load into Group
              // check for duplicates
              $(ui.helper).find("li").each(function (i) {
                if ($(groupLink).parent().find("li[id='"+$(this).attr("id")+"']").length>0) {
                  tmpAlert++;
                  if (tmpJumperList!='') { tmpJumperList=tmpJumperList+"\n"; }
                  tmpJumperList=tmpJumperList+$(groupLink).parent().find("li[id='"+$(this).attr("id")+"']").find("span").text();
*/
                  /*
                  if (tmpAlert==0) { alert("Moving Jumper(s) on Load"); tmpAlert++; }
                  
                  // Remove Previous Jumper
                  $(groupLink).parent().find("li[id='"+$(this).attr("id")+"']").remove();
                  // Create New Blank Slots
                  addManifestSheetLoadGroup($(groupLink).parent());
                  */
/*
                }
              });
              
              if (tmpAlert>0) {
              	alert("Jumper(s) Already On Load, Must Remove First:\n\n"+tmpJumperList);
              	return;
              }
              
              
            } else {
              // Moving Single User, Throw on already existing
              if ($(this).parent().find("li[id='"+$(ui.helper).find("li").attr("id")+"']").length>0) {
              	alert("Jumper already On Load, Must Be Removed First.");
              	return;
*/
              	/*
              	// dropping jumper
              	if ($(this).find("li[id='blankSlot']").length>0) {
              		// Dropping it on a blank spot
                  alert("Jumper already On Load, Must Be Removed First.");
                  return;
              	} else {
              		// dropping it on a group
              		alert("Moving Jumper on Load");
                  // Remove Previous Jumper
                  if ($(this).parent().find("ol li[id='"+$(ui.helper).find("li").attr("id")+"']").parent().find("li").length==1) {
                    $(this).parent().find("ol li[id='"+$(ui.helper).find("li").attr("id")+"']").parent().remove();
                  } else {
                    $(this).parent().find("ol li[id='"+$(ui.helper).find("li").attr("id")+"']").remove();
                  }
                  // Create New Blank Slots
                  addManifestSheetLoadGroup($(this).parent());
              	}
              	*/
/*
              };
            }
*/
            
            // Decide if enough slots are available
            if ($(this).parent().find("li[id='blankSlot']").length<$(ui.helper).find("li").length) {
              alert("Not Enough Slots Available");
              return;
            }
            
            
              // Adding to Blank Slot
              if ($(this).find("li").attr("id")=="blankSlot") {
                $(this).html($(ui.helper).html()); // Simply Rewrite the Slot HTML

                if ($(ui.helper).find("li").length>1) { // Check if moving more than 1 person to remove other blank slots
                  // Remove Blank Slots
                  removeManifestSheetBlankSlots($(this).parent(),$(ui.helper).find("li").length-1);
                }
                
                if ($(ui.helper).closest('.manifest_sheet').length!=0) {

                  //addManifestSheetLoadGroup($(ui.helper).parent());
                  $(ui.helper).html(blankSlot_html);

                  routinesManifestSheet($(ui.helper).closest('.manifest_pane'));
                  
                  //$(ui.helper).remove();
                } else {
                  removeJumperFromClipboard($(ui.helper).find('li').attr('id'));
                }
              }
            
            // Fixup Manifest Sheet After Changes
            routinesManifestSheet($(this).closest('.manifest_pane'));
            setTimeout("save_data();",250);
          }	
        });    	
    }
    
    
    function removeJumperFromClipboard(i) {
      $("#jumpers_box").find("#jumperlist_sheet li[id='"+i+"']").eq(0).parent().css('border-bottom','0');
      setTimeout("$('#jumpers_box').find('#jumperlist_sheet li[id=\""+i+"\"]').eq(0).parent().remove()",100);
    }



    



    // Update Manifest Sheet Sortable Functionality
    function makeManifestListsSortable() {
        // Make Each Manifest Sheet Sortable, Disable Selection
        $("#manifest_sheet_container").sortable({ 
          update: function(event, ui) { 
            // Update Plane Times
            
          },
          stop: function(event, ui) { 
            //updateManifestSheetCount(this);
            setTimeout("save_data();",200);
          },
          scrollSpeed: 50,
          handle: 'div.manifest_header',
          containment: 'body',
          change: function(event, ui) { ui.placeholder.css({visibility: 'visible', border: '1px solid black', background: 'green'}); },
          appendTo: 'body',
          forceHelperSize: true,
          forcePlaceholderSize: true,
          helper: 'clone',
          items: '.manifest_pane',
          tolerance: 'pointer',
          delay: 350,
          opacity: 0.7,
          start: function(event, ui) { ui.helper.css({background: 'green'}); },
          
        });
    }

    

    
    

			
			
function activateNewMessageList() {
  $('#messageList_add').unbind('click').bind('click',function() {
    addMessageListMessage();
    $('#messageListTimer').val('');
    setTimeout("save_data();",250);
  });
  
  loopMessageTimers();
}

function addMessageListMessage() {
  var messageEntry = $('<div class="messageEntry"><span class="messageText"></span>&nbsp;<span class="messageTime"></span>&nbsp;in&nbsp;<b><span class="messageTimer"></span></b><span class="messageEpoch" style="display:none;"></span></div>');
  
  messID = 0;
  hasID = 0;
  cntEr = 0;
  while (hasID == 0) {
    cntEr++;
    messID++;

    idFound = 0;
    $('#messageList_box').find('.messageEntry').each(function() {
      if ($(this).attr('id').replace(/[^0-9]/g,"") == messID) idFound = 1;
    });
    if (cntEr > 1000) { alert("Failed to Add Message, Clean Database"); hasId = 2;}
    if (idFound == 0) { hasID = 1; }
  }
  
  
  var timerMinutes = $('#messageListTimer').val().replace(/[^0-9]/g,"");
  var dMs = 0;

  if (!!timerMinutes) {
    var dn = new Date();
    dMs = dn.getTime()+Math.floor(timerMinutes*60000);
    var d = new Date(dMs);
  
    var dHr = d.getHours();
    var dMin = d.getMinutes();
    var dAP = "";
  
    if (dHr > 12) { dHr-=12; dAP = "PM"; } else { dAP = "AM"; }
    if (dMin<10) { dMin = "0"+dMin; }

    messageEntry.find('.messageTime').text(dHr+':'+dMin+' '+dAP);
  }

  messageEntry.attr('id', 'messageEntry_'+messID);
  messageEntry.find('.messageText').text($('#messageListText').val());
  messageEntry.find('.messageEpoch').text(dMs);
  messageEntry = parseTimer(messageEntry);
  $('#messageList_box').prepend(messageEntry);


  setTimeout("save_data();",200);
}

function showMessageList() {
  $("#messageList_box").html(messagelist_html); 
}

function removeMessageListMessage(id) {
  
  setTimeout("save_data();",250);
}

var messageTimerLock = 0;
function loopMessageTimers() {

  setTimeout("loopMessageTimers();",6000);
  
  if (messageTimerLock == 0) {
    messageTimerLock = 1;
    $('#messageList_box').find('.messageEntry').each(function() {
      parseTimer(this);
    });
    messageTimerLock = 0;
  }
}