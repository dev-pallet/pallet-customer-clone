"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = void 0;

var _serializeJavascript = _interopRequireDefault(
  require("serialize-javascript")
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var assets = require("./../../webpack-assets.json");

function render(req, res) {
  var metaData =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var context = {}; 
  // Get Title from req object
  var hostname = req.hostname;
  res.send(renderHtml(metaData));
}

function inlineFonts() {
  return '\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&display=swap" rel="stylesheet">\n  ';
}

function inlineGlobalStyles() {
  return "\n    body {\n      font-family: 'Epilogue', sans-serif;\n    }\n  ";
}

function getStyleSheets(assets) {
  var mainCss = assets.main.css;

  if (!mainCss) {
    return "";
  }

  return '<link href="'.concat(mainCss, '" as="style" rel="stylesheet"/>');
}

function renderHtml(_ref) {
  let webImgTaskbar =
    "https://ci3.googleusercontent.com/mail-sig/AIorK4xBKfLBiC-O68Mlj8fpqR4_WOzCnodCTlZxNcKBU8Tg6jfngh0K2ol2fFdBLp69bFjaOmyMLN8";

  var _ref$title = _ref.title,
    title =
      _ref$title === void 0 ? "Online Shopping Site for Groceries" : _ref$title,
    _ref$pageData = _ref.pageData,
    pageData = _ref$pageData === void 0 ? {} : _ref$pageData;
  var mainJs = assets.main.js;
  var vendorJs = assets.vendor.js;
  return `\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <meta charset="UTF-8">\n      <meta http-equiv="X-UA-Compatible" content="IE=edge">\n      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">\n <link rel="icon" href=${webImgTaskbar} type="image/x-icon">\n     <title>`
    .concat(title, "</title>\n      ")
    .concat(inlineFonts(), "\n      ")
    .concat(
      getStyleSheets(assets),
      '\n    </head>\n    <body>\n      <div id="app"></div>\n      <script>window.__pageData = '
    )
    .concat(
      (0, _serializeJavascript["default"])(pageData),
      '</script>\n      <script src="'
    )
    .concat(vendorJs, '"></script>\n      <script src="')
    .concat(mainJs, '"></script>\n\n    </body>\n    </html>\n  ');
}

var _default = render;
exports["default"] = _default;
