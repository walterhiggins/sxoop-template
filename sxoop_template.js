//
// Copyright Sxoop Technologies Ltd. 2006 (c). 
//
var SXOOP = SXOOP || {};

SXOOP.template = 
{
    //
    // Parse a template (supplied as a string), substituting
    // the supplied object ($) 
    // The $ variable refers to the object which was passed into the parse function
    // Usage:
    // [1] alert(SXOOP.template.parse("Hello [:= $ :] !","world"));
    // [2] alert(SXOOP.template.parse("Hello [:= $.name :]", {name: "Dave"}));
    // [3] var beatles = ["George","Paul","John","Ringo"];
    //     var template = "<ol>[:for (var i = 0;i < $.length;i++){ :]" + 
    //                       "<li>[:= $[i] :]</li>" +
    //                    "[: } :]</ol>";
    //     var result = SXOOP.template.parse(template,beatles);
    //     
    //     

    parse: /* String */ function ( /* String */ templateString, /* Object */ templateParams){},

    //
    // compile creates a function from a template which can be called with any set of data
    // it is faster if you want to use the template multiple times.
    // 
    // Usage:
    // var templateFn = SXOOP.template.compile("Hello [:= $ :]");
    // var message = templateFn('World');
    // alert(message);
    //

    compile: /* Function */ function( /* String */ templateString) {}
    
};
//
// private implementation
//
(function(){
    var _map = function(array, func) {
        var result = [];
        for (var i = 0;i < array.length; i++){ 
            var mapped = func(array[i],i);
            if (mapped){
                for (var j = 0; j < mapped.length; j++){
                    result.push(mapped[j]);
                }
            }
        }
        return result;
    };
    //
    // The include function facilitates inclusion of inner templates
    // Note: This include function is local to the parse function and will
    // override a global include function in the template scope only.
    //
    var _include = function(elementId,$) {
        var included = document.getElementById(elementId).innerHTML;
        return SXOOP.template.parse(included,$);
    };
    
    var _compile = function (str) 
    {
        var foreach = _map;
        var include = _include;
        var singleLine = str.replace(/[\n\r]/g,"");
        // innerHTML automatically converts < to &lt; and > to &gt;
        singleLine = singleLine.replace(/&lt;/g,"<");
        singleLine = singleLine.replace(/&gt;/g,">");
        

        //
        // Split the template into parts
        //
        var parts = _map(singleLine.split("[:"),function (part)
        {
            var result = [];
            if (part.match(/:\]/)){
                result = part.split(/:\]/g);
                result[0] = "[:" + result[0];
            }else{
                result = [part];
            }
            return result;
        });
        //
        // In firefox the following would suffice instead.
        // IE's implementation of split() is broken -  doesn't retain captured parts.
        //
        // parts = singleLine.split(/(\[:.*?):\]/);
        //
        // Process each part
        //
        var lines = _map(parts,function (part) 
        {
            var result = "";
            if (part.match(/\[:=/)){
                var inner = part.replace(/^\[:=\s*/,"");
                return ["theArray.push(" + inner + ");"];
            }
            if (part.match(/^\[:/)){
                var inner = part.replace(/^\[:/,"");
                //
                // wph 20080129
                // make sure that && isn't turned into 
                // &amp;&amp;
                //
                inner = inner.replace(/&amp;/g,"&");
                return [inner];
            }else{
                part = part.replace(/\"/g,"\\\"");
                return ["theArray.push(\"" + part + "\");"];
            }
        });
        var theArray = [];
        lines.push("var result = theArray.join('');");
        lines.push("return result; }");
        var javascript = "function($){ var theArray = [];\n"; 
        javascript += lines.join("\n");
        var compiled = eval("(" + javascript + ")");
        return compiled;
    };

    SXOOP.template.parse = function(str,o){
        var compiled = _compile(str);
        return compiled(o);
    };
    SXOOP.template.compile = function(str){
        return _compile(str);
    };
}());


