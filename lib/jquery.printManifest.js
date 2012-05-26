(function ($) {
    var counter = 0;
    var defaults = {
      headTitle: 'Skyscore Bigway Printout<br />'
    };
    var settings = {
      headTitle: defaults.headTitle
    }; //global settings
    
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
            writeDoc.write("#blankSlot { background-color: yellow; }");
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
              
                var DbEle = $('#jumperdatabase_sheet').find('li#'+$(this).attr('id'));
                
                jumperName = DbEle.find('#jumpername').text();

                if (!!jumperName && jumperName != '' && jumperName != '&nbsp;') {
                    jumperList[jumperList.length] = DbEle;
                }
            });
        }

        if (options != 'manifest' || options == 'clipboard') {
            $('div[id="jumperlist_sheet"]').find('.jumpSlot').each(function () {
              
                var DbEle = $('#jumperdatabase_sheet').find('li#'+$(this).attr('id'));
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

            htmlArr[i] = htmlArr[i] + '<ol class="manifest_group jumpGroup"><li class="jumpSlot">' + $(jumperList[j]).find('#jumpername').text() + '&nbsp;[FAI: '+$(jumperList[j]).find('.jumperFaiLic').text()+' '+$(jumperList[j]).find('.jumperFaiNation').text()+']<br />' + $(jumperList[j]).find('.jumperFirst').text() + ' ' + $(jumperList[j]).find('.jumperLast').text() + '</li></ol>';
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

    function getHead() {
        var head = "<head><title>" + settings.popTitle + "</title>";
        $(document).find("link")
            .filter(function () {
                return $(this).attr("rel").toLowerCase() == "stylesheet";
            })
            .filter(function () { // this filter contributed by "mindinquiring"
                var media = $(this).attr("media");
                //return (media.toLowerCase() == "" || media.toLowerCase() == "print")
                return "print";
            })
            .each(function () {
                head += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >';
            });
        head += "</head>";
        return head;
    }
    function getFormData(ele) {
        $("input,select,textarea", ele).each(function () {
            // In cases where radio, checkboxes and select elements are selected and deselected, and the print
            // button is pressed between select/deselect, the print screen shows incorrectly selected elements.
            // To ensure that the correct inputs are selected, when eventually printed, we must inspect each dom element
            var type = $(this).attr("type");
            if (type == "radio" || type == "checkbox") {
                if ($(this).is(":not(:checked)")) this.removeAttribute("checked");
                else this.setAttribute("checked", true);
            }
            else if (type == "text")
                this.setAttribute("value", $(this).val());
            else if (type == "select-multiple" || type == "select-one")
                $(this).find("option").each(function () {
                    if ($(this).is(":not(:selected)")) this.removeAttribute("selected");
                    else this.setAttribute("selected", true);
                });
            else if (type == "textarea") {
                var v = $(this).attr("value");
                if ($.browser.mozilla) {
                    if (this.firstChild) this.firstChild.textContent = v;
                    else this.textContent = v;
                }
                else this.innerHTML = v;
            }
        });
        return ele;
    }
    function Iframe() {
        var frameId = settings.id;
        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
        var iframe;

        try {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            $(iframe).attr({ style: iframeStyle, id: frameId, src: "" });
            iframe.doc = null;
            iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
        }
        catch (e) { throw e + ". iframes may not be supported in this browser."; }

        if (iframe.doc == null) throw "Cannot find document.";

        return iframe;
    }
})(jQuery);