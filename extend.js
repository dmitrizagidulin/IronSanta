// Taken from https://github.com/yui/yui2/blob/master/src/yahoo/js/Lang.js
// after reading http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/
Object.extend = function(subc, superc) {
        if (!superc||!subc) {
            throw new Error("extend failed, please check that " +
                            "all dependencies are included.");
        }
        var F = function() {}, i;
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
}