const Document = require('sketch/dom').Document
const Style = require('sketch/dom').Style
const colorable = require('colorable')
const CSS = `*,*:after,*:before{margin:0;padding:0;border:none;outline:none;box-sizing:inherit}html{box-sizing:border-box;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif}header{padding:1em;background-color:#fff}h4{padding:1em 0;text-align:center}a{color:#333;text-decoration:underline}a:hover{text-decoration:none}table{width:100%;border-spacing:0;table-layout:fixed}th{font-weight:500;padding:1em;width:25%}.badge{padding:0.5em;text-align:center}.strip{width:100%;padding:1.5em}.burger-input{top:0;left:0;opacity:0;width:100%;height:45px;cursor:pointer;position:absolute}.burger-input + label{width:30px;display:block;cursor:pointer;position:relative}.burger-input + label .burger,.burger-input + label:after,.burger-input + label:before{content:'';width:25px;height:4px;display:block;margin:3px auto;background-color:#333;-webkit-transition:all 200ms ease-in-out;transition:all 200ms ease-in-out}.burger-input:checked + label:before{-webkit-transform:translateY(2px) rotate(135deg);transform:translateY(2px) rotate(135deg)}.burger-input:checked + label:after{-webkit-transform:translateY(-12px) rotate(-135deg);transform:translateY(-12px) rotate(-135deg)}.burger-input:checked + label .burger{-webkit-transform:scale(0);transform:scale(0)}.burger-input:checked ~ nav{display:block}nav{display:none;background:#ececec;border:1px solid #ccc;padding:1em;margin:1em 0 0}ul{width:100%;list-style:none;text-align:left;font-weight:normal;font-size:14px;color:#333}ul li span{font-weight:bold;width:80px;display:inline-block;text-align:right}ul li.last{text-align:right}`
let documentName = ''
let colors = []

function iterator(layer) {
  if(layer.type == 'ShapePath') {
    var fills = layer.style.fills

    if(fills.length > 0) {
      var topFill = fills[fills.length-1]

      if(topFill.fill == 'Color') {
        // `colorable` currently only supports RGB
        colors.push(topFill.color.slice(0, -2))
      }
    }
  }
}

function createFile(htmlStr) {
  let htmlContent = NSString.stringWithString_(htmlStr)
  let filepath = NSTemporaryDirectory() + documentName + '.html'
  htmlContent.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(filepath, true)
  let file = NSURL.fileURLWithPath(filepath)

  return file
}

function openFile(file) {
  NSWorkspace.sharedWorkspace().openFile(file.path())
}

function createHTML(result) {
  let markup = ''
  let table = ''
  const header = `
    <style>${CSS}</style>
    <header>
      <input class="burger-input" type="checkbox" id="click" />
      <label for="click">
        <div class="burger"></div>
      </label>
      <nav>
        <ul>
          <li><span>AA Large</span> - greater than 3:1 (for 14pt/18px+ bold text || for text larger than 18pt/24px)</li>
          <li><span>AA</span> - greater than 4.5:1</li>
          <li><span>AAA Large</span> - greater than 4.5:1 (for 14pt/18px+ bold text || for text larger than 18pt/24px)</li>
          <li><span>AAA</span> - greater than 7:1</li>
          <li class="last">Built by: Bryan Berger. <a href="https://github.com/bryanberger/sketch-wcag">Github</a></li>
        </ul>
      </nav>
    </header>
  `

  for (let i = 0; i < result.length; i++) {
    let textColor = isDark(result[i].values.rgb) ? '#fff' : '#000'
    let aaStr = ''
    let aaLargeStr = ''
    let aaaStr = ''
    let aaaLargeStr = ''

    for (let x = 0; x < result[i].combinations.length; x++) {
      let dict = result[i].combinations[x].accessibility
      let resultObj = result[i]

      if(!dict['aa'] && !dict['aaLarge'] && !dict['aaa'] && !dict['aaaLarge']) {
        // all empty for this color skip it
        continue
      } else {
        if(dict['aa']) {
          aaStr += createColorBadge(resultObj, x)
        } else {
          aaStr += createEmptyBadge()
        }

        if(dict['aaLarge']) {
          aaLargeStr += createColorBadge(resultObj, x)
        } else {
          aaLargeStr += createEmptyBadge()
        }

        if(dict['aaa']) {
          aaaStr += createColorBadge(resultObj, x)
        } else {
          aaaStr += createEmptyBadge()
        }

        if(dict['aaaLarge']) {
          aaaLargeStr += createColorBadge(resultObj, x)
        } else {
          aaaLargeStr += createEmptyBadge()
        }
      }
    } // end 2nd loop

    // No Match Check
    if(aaStr == '' && aaLargeStr == '' && aaaStr == '' && aaaLargeStr == '') {
      table = `
        <tr>
          <td style="text-align: center;">
            Not accessibile with any of the other colors.
          </td>
        </tr>
        `
    } else {
      table = `
        <tr>
          <th>AA Large</th>
          <th>AA</th>
          <th>AAA Large</th>
          <th>AAA</th>
        </tr>
        <tr>
          <td>${aaLargeStr}</td>
          <td>${aaStr}</td>
          <td>${aaaLargeStr}</td>
          <td>${aaaStr}</td>
        </tr>
      `
    }

    // Wrap
    markup += `
      <div class="strip" style="color: ${textColor}; background-color: ${result[i].hex};"
        <small>${result[i].hex}</small>
        <table style="color: ${textColor};">
          ${table}
        </table>
      </div>
    `
  } // end first loop

  return header + markup
}

function createColorBadge(resultObj, x){
  return `
    <div class="badge" style="color: ${resultObj.hex}; background-color: ${resultObj.combinations[x].hex}">
      ${resultObj.combinations[x].hex}
    </div>
  `
}

function createEmptyBadge() {
  return `
    <div class="badge">
      &nbsp;
    </div>
  `
}

function readFile(path){
  return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null)
}

function isDark(rgb) {
	// YIQ equation from http://24ways.org/2010/calculating-color-contrast
	var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
	return yiq < 128
}

export default function(context) {
  const documentObj = context.document
  const doc = Document.getSelectedDocument()
  const selection = doc.selectedLayers

  documentName = documentObj.displayName()

  if(selection.length > 0) {
    selection.forEach(layer => { iterator(layer) })

    if(colors.length > 1) {
      const results = colorable(colors, {compact: false, threshold: 0})
      const html = createHTML(results)
      const file = createFile(html)

      openFile(file)
      context.document.showMessage('HTML file created')
    } else {
      context.document.showMessage('Please choose at least 2 shapes with different solid colors to test')
    }
  }
}
