/**
 * jquery 导出页面标签为word文件
 * 使用方法：$('#xxxxx').wordExport(name)
 * **/
if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
  (function ($) {
    $.fn.wordExport = function (fileName) {
      fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
      var staticJq = {
        /** 原来的默认配置 **/
        // mhtml: {
        //     top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
        //     head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
        //     body: "<body>_body_</body>"
        // }
        /** 新版的默认 页面视图 配置 **/
        mhtml: {
          top: 'Mime-Version: 1.0\nContent-Base: ' +
          location.href +
          '\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: ' +
          location.href +
          '\n\n<!DOCTYPE html' +
          '>\n<html ' +
          'xmlns:v="urn:schemas-microsoft-com:vml" ' +
          'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
          'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
          'xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" ' +
          'xmlns="http://www.w3.org/TR/REC-html40"' +
          '>\n_html_</html>',
          head: '<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n' +
            '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]-->\n'+
          '<style>' +
          '@page WordSection1{\n' +
          '\tsize:595.3pt 841.9pt;\n' +
          '\tmargin:72.0pt 90.0pt 72.0pt 90.0pt;\n' +
          '\tmso-header-margin:42.55pt;\n' +
          '\tmso-footer-margin:49.6pt;\n' +
          '\tmso-paper-source:0;\n' +
          '}\n' +
          '@page WordSection1{\n' +
          '\tsize:595.3pt 841.9pt;\n' +
          '\tmargin:36.0pt 36.0pt 36.0pt 36.0pt;\n' +
          '\tmso-header-margin:42.55pt;\n' +
          '\tmso-footer-margin:49.6pt;\n' +
          '\tmso-paper-source:0;\n' +
          '}' +
          '\n_styles_\n</style>\n</head>\n',
          body: '<body>_body_</body>'
        }
      };
      var options = {
        maxWidth: 624
      };
      // Clone selected element before manipulating it
      var markup = $(this).clone();

      // Remove hidden elements from the output
      markup.each(function () {
        var self = $(this);
        if (self.is(':hidden'))
          self.remove();
      });

      // Embed all images using Data URLs
      var images = Array();
      var img = markup.find('img');
      for (var i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        var canvas = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        var context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        var uri = canvas.toDataURL("image/png");
        $(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
          type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
          encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
          location: $(img[i]).attr("src"),
          data: uri.substring(uri.indexOf(",") + 1)
        };
      }

      // Prepare bottom of mhtml file with image data
      var mhtmlBottom = "\n";
      for (var i = 0; i < images.length; i++) {
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
        mhtmlBottom += "Content-Location: " + images[i].location + "\n";
        mhtmlBottom += "Content-Type: " + images[i].type + "\n";
        mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
        mhtmlBottom += images[i].data + "\n\n";
      }
      mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

      //TODO: load css from included stylesheet
      var styles = "";
      // Aggregate parts of the file together
      var fileContent = staticJq.mhtml.top.replace("_html_", staticJq.mhtml.head.replace("_styles_", styles) + staticJq.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;
      // Create a Blob with the file contents
      var blob = new Blob([fileContent], {
        // type: "application/msword;charset=utf-8"
        /** 修改为默认打开 页面视图 配置 **/
        type: "application/ms-word;charset=utf-8"
      });

      saveAs(blob, fileName + ".doc");
    };
  })(jQuery);
} else {
  if (typeof jQuery === "undefined") {
    console.error("jQuery Word Export: missing dependency (jQuery)");
  }
  if (typeof saveAs === "undefined") {
    console.error("jQuery Word Export: missing dependency (FileSaver.js)");
  }
}
