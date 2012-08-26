Sxoop Template
==============
A javascript templating library.
See example_beatles.html for an example of how to use this library.
The '$' variable is used in templates to reference the object in scope.

Example 1:
----------
A simple template that replaces text.

    var template = "Hello [:= $ :]";
    var message = SXOOP.template.parse(template,"World");    
    alert(message);

Example 2:
----------
Embedding javascript in a template.

    <!-- the template string is stored in a hidden textarea -->
    <texarea style="display:none" id="template">
    <table>
        [: for (var i = 0;i < $.length; i++){ :]
        <tr>
            <td>[:= $[i].name :]</td>
            <td>[:= $[i].instrument :]</td>
        </tr>
        [: } :]
    </table>
    </textarea>
    
    <div id="bandInfo"><!-- templated result will go here --></div>
    ...
    var theBeatles = [];
    theBeatles.push({name: "Paul", instrument: "Bass Guitar"});
    ...
    theBeatles.push({name: "Ringo", instrument: "Drums"});

    var templateStr = document.getElementById("template");
    var compiled = SXOOP.template.compile(templateStr);
    var html = compiled(theBeatles);
    document.getElementById("bandInfo").innerHTML = html;

    