(function ($) {
  $.fn.printList = function (options) {
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

    var perCount = 0;
    var perColLength = 15;

    var colCountBeforeBreak = 0;

    var i = 0;
    htmlArr[i] = '';

    if (options == 'manifest') {
      htmlHead = 'Manifested Skydivers';
    }
    if (options == 'clipboard') {
      htmlHead = 'Jumpers on Clipboard';
    }

    if (options != 'clipboard') {
      $('#manifest_sheet_container').find('.jumpSlot').each(function () {

        var DbEle = $('#jumperdatabase_sheet').find('li#' + $(this).attr('id'));

        jumperName = DbEle.find('#jumpername').text();

        if (!!jumperName && jumperName != '' && jumperName != '&nbsp;') {
          jumperList[jumperList.length] = DbEle;
        }
      });
    }

    if (options != 'manifest' || options == 'clipboard') {
      $('div[id="jumperlist_sheet"]').find('.jumpSlot').each(function () {

        var DbEle = $('#jumperdatabase_sheet').find('li#' + $(this).attr('id'));
        jumperName = DbEle.find('div[id="jumpername"]').html().replace(/(<([^>]+)>)/ig, "");

        if (!!jumperName && jumperName != '' && jumperName != '&nbsp;') {
          jumperList[jumperList.length] = DbEle;
        }
      });
    }


    jumperList.sort(function (x, y) {
      var a = $(x).find('.jumperFirst').text().toUpperCase();
      var b = $(y).find('.jumperFirst').text().toUpperCase();
      if (a > b)
        return 1
      if (a < b)
        return -1
      return 0;
    });

    for (j in jumperList) {

      if (perCount == perColLength) {
        i = i + 1;
        perCount = 0;
        htmlArr[i] = '';
      }

      htmlArr[i] = htmlArr[i] + '<ol class="manifest_group jumpGroup"><li class="jumpSlot">' + $(jumperList[j]).find('#jumpername').text() + '&nbsp;[FAI: ' + $(jumperList[j]).find('.jumperFaiLic').text() + ' ' + $(jumperList[j]).find('.jumperFaiNation').text() + ']<br />' + $(jumperList[j]).find('.jumperFirst').text() + ' ' + $(jumperList[j]).find('.jumperLast').text() + '</li></ol>';
      perCount = perCount + 1;

    }




    writeDoc.open();
    writeDoc.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01Trasitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n");
    writeDoc.write("<html>\n");
    writeDoc.write(getHead() + "\n");
    writeDoc.write("<body>\n");


    writeDoc.write('<div id="manifest_sheet_container">');
    var icnt = 0;
    for (i in htmlArr) {
      colCountBeforeBreak++;

      writeDoc.write('<div class="manifest_sheet" style="float:left;width:46%;margin:2%;font-size:11pt;font-family:monospace;">');

      writeDoc.write('<div style="padding:4px;border-bottom:1px solid black;">' + htmlHead + '</div>');

      writeDoc.write(htmlArr[i]);

      writeDoc.write('</div>');

      if (colCountBeforeBreak == 2 && i != htmlArr.length) {
        writeDoc.write('<div style="clear:both;page-break-before:always;" />');
        colCountBeforeBreak = 0;
      }
    }

    writeDoc.write('</div>');
    writeDoc.write("</body>\n");
    writeDoc.write("</html>");
    writeDoc.close();

    printWindow.focus();
    printWindow.print();

    printWindow.close();
  }
})(jQuery);