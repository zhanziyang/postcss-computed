var postcss = require("postcss");
var ava = require("ava");
var plugin = require("./");

function run(t, input, output, opts = {}) {
  return postcss([plugin(opts)]).process(input)
    .then(result => {
      t.deepEqual(result.css, output);
      t.deepEqual(result.warnings().length, 0);
    });
}
var input = '\
@func add($num1, $num2) {\
  width: $num1;\
  @stmt return $num1 + $num2;\
}\
@func multi($num1, $num2) {\
  @stmt return $num1 * $num2;\
}\
a {\
  width: func.add(1, 1)px;\
}\
';

var output = '\
a {\
  width: 2px;\
}\
';
ava('test func', t => {
  return run(t, input, output, {});
});

var input2 = '\
@func vrelative($l) {\
  @stmt var h=1336;\
  @stmt return h;\
}\
@func add($num1, $num2) {\
  @stmt var $w = 5;\
  @stmt if ($w > 0) {\
    @stmt for(var i = 0; i < 4; i++) {\
      @stmt $w++;\
    }\
  }\
  @stmt return $w + $num2;\
  @stmt $w++;\
}\
@func multi($num1, $num2) {\
  @stmt return $num1 * $num2;\
}\
a {\
  width: func.add(1, 1)px;\
  height: func.vrelative(1)px;\
}\
';

var output2 = '\
a {\
  width: 10px;\
  height: 1336px;\
}\
';

ava('test func with statement', t => {
  return run(t, input2, output2, {});
});
