Function.prototype.bind = function(context){
    var args = Array.prototype.slice.call(arguments, 1),
        self = this
    return function(){
        var innerArgs = Array.prototype.slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return self.apply(context,finalArgs)
    }
}