var node_xj = require("xls-to-json");
var fs = require('fs');
var wstream = fs.createWriteStream('myOutput.opml');

node_xj({
    input: "sampler.xlsx", // input xls 
    output: "output.json", // output json 
    sheet: "Sheet3" // specific sheetname 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        // console.log(result);
        myFunction(result);
    }
});

var mainTitle = 'mixe subscriptions in feedly Cloud';
var subTitle = 'International News 12';


var myFunction = function(jsonObject) {
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
