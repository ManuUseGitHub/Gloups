function load(filepath){
	var client = new XMLHttpRequest();
    
    client.open('GET', filepath);

    client.onreadystatechange = function() {
        var converter = new showdown.Converter(),
            text = client.responseText,
            html = converter.makeHtml(text);
        $('#content').html(html);
    }
    client.send();	
}