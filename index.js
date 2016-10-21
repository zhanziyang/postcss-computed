var postcss = require("postcss");

module.exports = postcss.plugin("postcss-func", function (opts) {
  opts = opts || {};

  return function (css) {
    var funcs = {};
    // collect all functions defined.
    css.walkAtRules("func", atRule => {
      var nodes = atRule.nodes;
      if (!nodes) return;

      var funcDecl = atRule.params;
      var fdPattern = /^[a-zA-Z\_\$][\w\_\$ ]+\(([\w\_\$]+, *)*[\w\_\$ ]+\)$/g;
      fdPattern.lastIndex = 0;
      if (!funcDecl || !fdPattern.test(funcDecl)) return; //validate function declaration 

      var funcName = funcDecl.slice(0, funcDecl.indexOf("("));
      if (!funcName) return;

      var argsStr = funcDecl.slice(funcDecl.indexOf("(") + 1, funcDecl.indexOf(")"));
      var args = argsStr.split(",").map((piece) => piece.trim());

      var funcBody = "";
      atRule.each((childnode) => {
        if (childnode.type !== "atrule" || childnode.name !== "stmt") return;
        var stmtAtRule = childnode;
        var stmt = "";

        (function (rule) {
          if (rule.nodes !== undefined) {
            //statement atrule with a block;
            stmt += (rule.params + "{");
            var callee = arguments.callee;
            rule.each((_childnode) => {
              if (_childnode.type !== "atrule" || _childnode.name !== "stmt") return;
              callee(_childnode);
            });
            stmt += "}";
          } else {
            stmt += (rule.params + ";");
          }
        } (stmtAtRule));

        funcBody += stmt;
      });


      funcs[funcName] = Function.apply(Function, args.concat(funcBody));
      css.removeChild(atRule); //remove function definition from the compiled css
      // console.log(funcBody);
    });

    //find function calls and replace it with the result
    css.walkDecls(decl => {
      var value = decl.value;
      var callPattern = /^func\.([a-zA-Z\_\$][\w\_\$]+)\((.*)\)/g;
      callPattern.lastIndex = 0;
      if (!value.match(callPattern)) return;

      decl.value = value.replace(callPattern, function (match, funcName, argStr) {
        var func = funcs[funcName];
        if (!func) throw decl.error("function " + funcName + " is undefined.", { plugin: "postcss-func" });
        var args = argStr.trim().split(",").map(arg => eval(arg.trim()));
        return func.apply(func, args);
      });

    });
  };
});