(function ($) {
  // Prints Manifest Sheets
  $.fn.printManifestAll = function (options) {
    $.extend(settings, defaults, options);

    counter++;
    var idPrefix = "printArea_";
    $("[id^=" + idPrefix + "]").remove();
    var ele = getFormData($(this));

    var writeDoc;
    var printWindow;

    settings.popTitle = 'List of Names';

    var f = new Iframe();
    writeDoc = f.doc;
    printWindow = f.contentWindow || f;

    var htmlHead = '';
    var htmlArr = new Array();
    var jumperList = new Array();
    var slotLen = $('#manifest_sheet_container').find('.jumpSlot').length;

    var colCountBeforeBreak = 0;

    var nD = new Date();
    var nDHr = nD.getHours();
    var nDMin = nD.getMinutes();
    var nDAP = "";

    if (nDHr > 12) { nDHr -= 12; nDAP = "PM"; } else { nDAP = "AM"; }
    if (nDMin < 10) { nDMin = "0" + nDMin; }

    var headDateStamp = nDHr + ':' + nDMin + ' ' + nDAP;
    //var headDateStamp = $.format.date(nD, "MM/dd/yyyy hh:mm a")

    writeDoc.open();
    writeDoc.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01Trasitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n");
    writeDoc.write("<html>\n");
    writeDoc.write(getHead() + "\n");

    if (options == "AZManifestSheet") {
      writeDoc.write("<style type=\"text/css\">");
      writeDoc.write(".manifest_sheet .right_number { display: none; }");
      writeDoc.write(".manifest_sheet .left_number { display: none; }");
      writeDoc.write(".manifest_sheet ol { margin: 0; padding: 0;  border:0px; }");
      writeDoc.write(".manifest_sheet li { text-align: left; padding: 0; margin: 8px; }");
      writeDoc.write("</style>");
    }
    writeDoc.write("<body>\n<center>");


    if (options == "AZManifestSheet") {
      writeDoc.write('<div style="height: 177px;">&nbsp;</div>');
    } else {
      writeDoc.write('<div class="printHeader">' + settings.headTitle + '<span style="font-size:14pt;">' + headDateStamp + '</span></div>');
    }

    writeDoc.write('<div id="manifest_sheet_container">');


    var tCount = $('#manifest_sheet_container').find('li[class="manifest_pane"]').length;
    var thisCount = 0;
    $('div[id="manifest_sheet_container"]').find('li[class="manifest_pane"]').each(function () {
      colCountBeforeBreak++;
      thisCount++;

      if (options == "AZManifestSheet") {
        writeDoc.write('<div class="manifest_sheet" style="width:256px;margin:0;padding:0;font-size:11pt;font-family:monospace;">');
      } else {
        writeDoc.write('<div class="manifest_sheet" style="float:left;width:46%;margin:2%;font-size:11pt;font-family:monospace;">');
      }

      htmlHead = $(this).find('.loadinformation').html().replace(/(<([^>]+)>)/ig, "");

      if (options == "AZManifestSheet") {

      } else {
        writeDoc.write('<div style="padding:4px;border-bottom:1px solid black;">' + htmlHead + '</div>');
      }


      $(this).find('ol').each(function () {
        writeDoc.write('<ol class="manifest_group jumpGroup">' + $(this).html() + '</ol>');
      });

      //writeDoc.write($(this).find('.manifest_sheet_footer').html());

      writeDoc.write('</div>');

      if (options == "AZManifestSheet") { perPgCnt = 1; } else { perPgCnt = 2; }
      if (colCountBeforeBreak == perPgCnt && thisCount != tCount) {
        if (options == "AZManifestSheet") {
          writeDoc.write('<div style="clear:both;page-break-before:always;"></div>');
          writeDoc.write('<div style="height: 183px;">&nbsp;</div>');
        } else {
          writeDoc.write('<div class="printFooter">A Skyscore Product. (c) Gary Taylor</div>');
          writeDoc.write('<div class="printHeader" style="clear:both;page-break-before:always;">' + settings.headTitle + '<span style="font-size:14pt;">' + headDateStamp + '</span></div>');
        }

        colCountBeforeBreak = 0;
      }
    });

    if (options != "AZManifestSheet") {
      writeDoc.write('<div class="printFooter">A Skyscore Product. (c) Gary Taylor</div>');
    }
    writeDoc.write('</div>');

    //writeDoc.write('<div class="printFooter">A Skyscore Product. (c) Gary Taylor</div>');


    writeDoc.write("</center></body>\n");
    writeDoc.write("</html>");
    console.log(f.doc);
    writeDoc.close();


    printWindow.focus();
    printWindow.print();

    printWindow.close();

  }
})(jQuery);