/*jshint esversion:6*/
class classReading {
    constructor() {
        this.line_ = null;
        this.data_ = null;
        this.iter_ = null;
        this.stopped_ = false;
    }

    initialize(data, iter) {
        this.data_ = data + ' ';
        this.iter_ = iter;
        this.line_ = [];
    }

    readLines(processingLine) {
        var c;
        while ((!this.stopped) && (c = this.getNextChar())) {

            // the line feed is encontoured 
            if (/^[\n\r]$/g.test(c) || this.isEndReached()) {
                this.toLine();
                processingLine(this.line);
                this.resetLine();
            }

            // just add the character
            else {
                this.feed(c);
            }
        }
    }

    stop() {
        this.stopped = true;
    }

    get stopped() {
        return this.stopped_;
    }

    set stopped(stopped) {
        this.stopped_ = stopped;
    }

    get iter() {
        return this.iter_;
    }

    set iter(iter) {
        this.iter_ = iter;
    }

    get data() {
        return this.data_;
    }

    set data(data) {
        this.data_ = data;
    }

    get line() {
        return this.line_;
    }

    set line(line) {
        this.line_ = line;
    }

    toLine() {
        this.line = this.line.join("");
        this.line = this.line.replace(/^[\n\r]$/g, '');
    }

    resetLine() {
        this.line = [];
    }

    getNextChar() {
        return this.data[this.iter++];
    }

    isEndReached() {
        return !this.data[this.iter];
    }

    feed(char) {
        this.line_.push(char);
    }
}