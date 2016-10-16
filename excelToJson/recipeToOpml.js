var file1 = 'HBL full rss_1073'
var mainTitle = 'Mixe subscriptions in feedly Cloud';
var subTitle = file1;



var fileName = file1 + '.recipe';
var outputFileName = file1 + '.opml';

var fs = require('fs');
// : feeds          = \[(\n.*\(.*\),)*\n.*\]
// var myRe = new RegExp("feeds          = \[(\n.*\(.*\),)*\n.*\]", "gm");
// var myRe = new RegExp("feeds          = \\[", "gm");

var matchedArray;
var resultJson = [];


fs.readFile(fileName, 'utf8', function(err, contents) {
    // console.log(contents);
    // console.log(typeof contents);
    // console.log(contents.match(/(?:.*\(?:.*\)),/gm));
    var matchedArray = contents.match(/(?:.*\(?:.*\)),/gm);
    var item;
    var itemSplitted;
    var itemJson;
    for (var i = 0; i < matchedArray.length; i++) {
      item = matchedArray[i];
      // console.log('item ' + i + ': '+  item);
      item = item.match(/(?:\(.*\))/gm)[0];
      item = item.replace(/\(|\)|'/gm, '');
      itemSplitted = item.split(', ');
      // console.log(itemSplitted);
      // console.log('item ' + i + ': '+  item);
      itemJson = {};
      itemJson['title'] = itemSplitted[0];
      itemJson['xmlUrl'] = itemSplitted[1];
      resultJson.push(itemJson);
    }
    // console.log(resultJson);
    convertToOpml(resultJson);
});



var convertToOpml = function(jsonObject) {
    // var START = '<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><head><title>mixe subscriptions in feedly Cloud</title></head><body><outline text="Sprituality 2" title="Sprituality 2">';
    var START = '';
    START = START + '<?xml version="1.0" encoding="UTF-8"?>\n';
    START = START + '\n';
    START = START + '<opml version="1.0">\n';
    START = START + '<head>\n';
    START = START + '<title>'+ mainTitle +'</title>\n';
    START = START + '</head>\n';
    START = START + '<body>\n';
    START = START + '<outline text="' + subTitle + '" title="' + subTitle +'">\n';


    // var END = '</outline></body></opml>';
    var END = '';
    END = END + '</outline>\n';
    END = END + '</body>\n';
    END = END + '</opml>\n';

    var fs = require('fs');
    var wstream = fs.createWriteStream(outputFileName);

    wstream.write(START + '\n');

    var result = '';

    var currentObject;
    var entityStart = '<outline ';
    var entityEnd = '/>';
    var entity;
    for (var i = 0; i < jsonObject.length; i++) {
        entity = '';
        currentObject = jsonObject[i];
        entity = entityStart + 
                 // 'type ="' + currentObject.type + '" ' +
                 'type ="rss" ' +
                 'title ="' + currentObject.title + '" ' +
                 'xmlUrl ="' + currentObject.xmlUrl + '" ' +
                 entityEnd;

        // console.log(entity);
        wstream.write(entity + '\n');
        // result = result + entity;
    }

    // result = START + result + END
    wstream.write(END);
    wstream.end();
}

