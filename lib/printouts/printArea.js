(function ($) {
  $.fn.printArea = function (options) {
    $.extend(settings, defaults, options);

    counter++;
    var idPrefix = "printArea_";
    $("[id^=" + idPrefix + "]").remove();
    var ele = getFormData($(this));

    var writeDoc;
    var printWindow;

    settings.popTitle = $(ele).find('.loadinformation').html().replace(/(<([^>]+)>)/ig, "");

    var f = new Iframe();
    writeDoc = f.doc;
    printWindow = f.contentWindow || f;

    var htmlHead = '';
    var htmlArr = new Array();
    var liLen = $(ele).find('li').length;

    var perCount = 0;
    var perColLength = 25;

    var i = 0;
    htmlArr[i] = '';

    htmlHead = $(ele).find('.loadinformation').html().replace(/(<([^>]+)>)/ig, "");
    $(ele).find('ol').each(function () {
      if (perCount == perColLength) {
        i = i + 1;
        perCount = 0;
        htmlArr[i] = '';
      }

      htmlArr[i] = htmlArr[i] + '<ol class="manifest_group jumpGroup">' + $(this).html().replace('display: none;', '') + '</ol>';
      perCount = perCount + 1;
    });



    writeDoc.open();
    writeDoc.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01Trasitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n");
    writeDoc.write("<html>\n");
    writeDoc.write(getHead() + "\n");
    writeDoc.write("<body>\n");
    writeDoc.write('<div id="manifest_sheet_container">');
    var icnt = 0;
    for (i in htmlArr) {
      if (icnt == 2) {
        writeDoc.write('<div style="clear:both;page-break-before:always;">&nbsp;</div>');
        icnt = 0;
      }
      writeDoc.write('<div class="manifest_sheet" style="float:left;width:40%;margin:5%;font-size:11pt;font-family:monospace;"><div style="padding:4px;border:1px solid black;">' + htmlHead + '</div>' + htmlArr[i] + '</div>');


      icnt = icnt + 1;
    }


    //writeDoc.write('<div class="manifest_sheet" style="float:left;width:40%;margin:5%;">'+htmlArr[1]+'</div>');
    //writeDoc.write('<div class="' + $(ele).attr("class") + '">'+$(ele).html()+'</div>');     
    //writeDoc.write('<div class="' + $(ele).attr("class") + '">'+$(ele).html()+'</div>');     
    //writeDoc.write('<div class="' + $(ele).attr("class") + '">'+$(ele).html()+'</div>');            
    writeDoc.write("</body>\n");
    writeDoc.write("</html>");
    writeDoc.close();

    printWindow.focus();
    printWindow.print();

    printWindow.close();
  }
})(jQuery);