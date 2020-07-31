function buildAlfameCV() {

  // URL JOSTA JSON RESUME LÖYTYY
  //
  // Vaihda URL ja aja.  Muodostaa JSNON resumen tiedoista Google Dokkarin "Alfamen pohjaan". (Nyt vasta POC)
  //=================================================================================================================

  var aURL = "https://raw.githubusercontent.com/AriPeltoniemi/JaskaJokunenResumeTest/master/JaskaJokunenCV.json";

  //=================================================================================================================




  var response = UrlFetchApp.fetch(aURL); // get feed
  var r = JSON.parse(response.getContentText());


  //Asetetaan ulkoasua Alfamen CV mukaisiksi

  var AlfameStytle = {};
  AlfameStytle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  AlfameStytle[DocumentApp.Attribute.LINE_SPACING] = 1;
  AlfameStytle[DocumentApp.Attribute.BOLD] = false;


  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BORDER_WIDTH] = 0;
  cellStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;

  var cLeft = {};
  cLeft[DocumentApp.Attribute.BOLD] = true;

  var cCenter = {};
  cCenter[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;

  var cRight = {};
  cRight[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.RIGHT;

  var small = {}
  small[DocumentApp.Attribute.FONT_SIZE] = 8;


  // Asemointia
  var taulunVasenWidth = 150;

  //Layout debuggausta varteb laita borderwith = 1 niin näkee taulukot
  var borderWith = 0;


  /*
  // JOS tehtäsiin header ohjelmmallisesti
  var hdr = DocumentApp.getActiveDocument().getHeader();
  if (hdr) {
    hdr.clear();
  }
  */

  var body = DocumentApp.getActiveDocument().getBody();


  //---  Tyhjätään dokumentti
  body.clear();


  // --- Astetaan Alfamen tyylejä -----
  body.setAttributes(AlfameStytle);   //Ei toimi?



  // ---- Nimi ---------

  //var ylaosa = body.appendParagraph("");
  var cell1 = [
      ['', '']
       ];

  var ylataulu = body.appendTable(cell1);

  //var nimi = ylataulu.getRow(0).getCell(0).appendParagraph(r.basics.name);
  var nimi = ylataulu.getRow(0).getCell(0).insertParagraph(0, r.basics.name);
  nimi.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  ylataulu.setBorderWidth(borderWith);
  ylataulu.getRow(0).getCell(0).setAttributes(cLeft);
  ylataulu.getRow(0).getCell(0).setWidth(400);

  // -------summary -----------

  //var summary = ylataulu.getRow(0).getCell(0).appendParagraph(r.basics.summary);
  var summary = ylataulu.getRow(0).getCell(0).insertParagraph(1, r.basics.summary);
  summary.setHeading(DocumentApp.ParagraphHeading.HEADING4)
  //summary.setForegroundColor('#ff0000');


   // --- henkilön kuva -----

   if (r.basics.picture) {
     var img = UrlFetchApp.fetch(r.basics.picture);
     var img_blob = img.getBlob();
     var pImage = ylataulu.getRow(0).getCell(01).appendImage(img_blob).setWidth(120).setHeight(140);
     ylataulu.getRow(0).getCell(01).setAttributes(cRight);

  }




  // ---------- OSOITE. --------------------
  // Ei tarvita tulee footerista


  body.appendHorizontalRule();





    // ---------    EXPERIENCE --------------------------------------

  var section = body.appendParagraph("Experience");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING3);

  for (var i = 0; i < r.work.length; i++) {
    var cell = [
      [r.work[i].position, r.work[i].company, parseDate(r.work[i].startDate) + ' to ' + parseDate(r.work[i].endDate)]
    ];
    var job = body.appendTable(cell);
    job.setBorderWidth(0);
    job.getRow(0).getCell(0).setAttributes(cLeft);

    job.getRow(0).getCell(0).getChild(0).asParagraph().setHeading(DocumentApp.ParagraphHeading.HEADING4);

    job.getRow(0).getCell(1).getChild(0).asParagraph().setAttributes(cCenter);
    if (r.work[i].website) {
      job.getRow(0).getCell(1).setLinkUrl(r.work[i].website);
    }
    job.getRow(0).getCell(2).getChild(0).asParagraph().setAttributes(cRight);
    if (r.work[i].summary) {
      body.appendParagraph(r.work[i].summary);
    }
    if (definedAndNotEmpty(r.work[i].highlights)) {
      for (var j = 0; j < r.work[i].highlights.length; j++) {

        var hl = body.appendListItem(r.work[i].highlights[j]);
        hl.setGlyphType(DocumentApp.GlyphType.HOLLOW_BULLET);

      }
    }
  }


    // ---------    SKILLS --------------------------------------


  // Append a section header paragraph.
  var section = body.appendParagraph("Skills");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  var sTbl = body.appendTable();
  sTbl.setBorderWidth(0);


  for (var i = 0; i < r.skills.length; i++) {
    var skills = sTbl.appendTableRow();
    skills.appendTableCell(r.skills[i].name + ':  ');
    sTbl.getRow(i).getCell(0).getChild(0).asParagraph().setAttributes(cLeft);
  //  sTbl.getRow(i).getCell(1).setAttributes(cLeft);

    sTbl.getRow(i).getCell(0).setWidth(taulunVasenWidth);
    var sklls = '';
    for (var j = 0; j < r.skills[i].keywords.length - 1; j++) {
      sklls += r.skills[i].keywords[j] + ', ';
    }

    sklls += r.skills[i].keywords[r.skills[i].keywords.length - 1] + '.';
    skills.appendTableCell(sklls);
    sTbl.getRow(i).getCell(1).getChild(0).asParagraph().setAttributes(AlfameStytle);

  }



  // ---------    EDUCATION  --------------------------------------



  var section = body.appendParagraph("Education");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  for (var i = 0; i < r.education.length; i++) {
    if (r.education[i].studyType) {
      var cell = [
        [r.education[i].studyType, r.education[i].institution, parseDate(r.education[i].startDate) + ' to ' + parseDate(r.education[i].endDate)]
      ];
    } else {
      var cell = [
        ['', r.education[i].institution, parseDate(r.education[i].startDate) + ' to ' + parseDate(r.education[i].endDate)]
      ];
    }
    var degree = body.appendTable(cell);

    degree.setBorderWidth(0);
    degree.getRow(0).getCell(0).setAttributes(cLeft);
    degree.getRow(0).getCell(0).setWidth(taulunVasenWidth);
    degree.getRow(0).getCell(1).getChild(0).asParagraph().setAttributes(cLeft);

    degree.getRow(0).getCell(2).getChild(0).asParagraph().setAttributes(cRight);
    if (definedAndNotEmpty(r.education[i].area)) {
      degree.getRow(0).getCell(1).appendParagraph(r.education[i].area);
      degree.getRow(0).getCell(1).getChild(1).asParagraph().setAttributes(cLeft);
    }
    if (definedAndNotEmpty(r.education[i].gpa)) {
      degree.getRow(0).getCell(2).appendParagraph('GPA:  ' + r.education[i].gpa);
      degree.getRow(0).getCell(2).getChild(1).asParagraph().setAttributes(cRight);
    }
    if (definedAndNotEmpty(r.education[i].summary)) {
      body.appendParagraph(r.education[i].summary);
    }
    if (definedAndNotEmpty(r.education[i].courses)) {
      body.appendParagraph("Courses:").setBold(true);
      for (var j = 0; j < r.education[i].courses.length; j++) {
        body.appendListItem(r.education[i].courses[j]).setGlyphType(DocumentApp.GlyphType.HOLLOW_BULLET);
      }
    }
  }


      // ---------    Kielitaito  --------------------------------------



  var section = body.appendParagraph("Kielitaito");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  for (var i = 0; i < r.languages.length; i++) {

    var cell = [
      [r.languages[i].language, r.languages[i].fluency]
       ];

    var kieli = body.appendTable(cell);

    kieli.setBorderWidth(borderWith);
    kieli.getRow(0).getCell(0).setAttributes(cLeft);
    kieli.getRow(0).getCell(0).setWidth(taulunVasenWidth);
    kieli.getRow(0).getCell(1).getChild(0).asParagraph().setAttributes(cLeft);

  }




  //----------------------------------------------------------
  // FOOTER RESET, ei tarvita jos footer tulee templatesta


  /*
  var foot = DocumentApp.getActiveDocument().getFooter();
  if (foot) {
    foot.clear();

  }
  */
}


// parse a date in yyyy-mm-dd format
function parseDate(input) {
  if (input) {
    var parts = input.split('-');
    if (parts[2]) return parts[1] + '/' + parts[2] + '/' + parts[0]
    else if (parts[1]) return parts[1] + '/' + parts[0]
    else return parts[0];
  } else {
    return "Present";
  }
}

function definedAndNotEmpty(value) {
  return (typeof value != 'undefined' && value.length > 0);
}