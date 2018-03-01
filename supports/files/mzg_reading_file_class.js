function classReading() {
    this.line;
    this.data;
    this.iter;
    this.stopped = false;
    this.initialize = function (data, iter) {
        this.data = data;
        this.iter = iter; 
        this.line = [];
    };

    this.readLines = function (processingLine){
        var c;
        while ( (!this.isStopped()) && (c = this.getNextChar())) {
            
            // the line feed is encontoured 
            if (/^[\n\r]$/g.test(c) || this.isEndReached()) {
                this.toLine();
                processingLine(this.getLine());
                this.resetLine();
            }

            // just add the character
            else {
                this.feed(c);
            }
        }
    }

    this.stop = function () {
        this.stopped = true;
    }
    this.isStopped = function () {
        return this.stopped;
    }

    this.setIter = function (iter) {
        this.iter = iter;
    }
    this.setData = function (data) {
        this.data = data;
    }

    this.toLine = function() {
        this.line = this.line.join("")
        this.line = this.line.replace(/^[\n\r]$/g, '');
    }
    this.resetLine = function () {
        this.line = [];
    }

    this.getIter = function () {
        return this.iter;
    }
    this.getData = function (){
        return this.data;
    }
    this.getLine = function () {
        return this.line;
    }

    this.getNextChar = function(){
        return this.data[this.iter++];
    }
    this.isEndReached = function () {
        return !this.data[this.iter];
    }

    this.feed = function (char) {
        this.line.push(char);
    }
}