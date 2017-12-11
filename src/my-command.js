const colorable = require('colorable')
const PATH_TO_CSS = context.plugin.urlForResourceNamed('styles.css').path().replace(/ /g, '\\ ')
let documentName = ''

export default function(context) {
  let colors = []

  const sketch    = context.api()
  const documentObj = context.document
  const document  = sketch.selectedDocument
  const selection = document.selectedLayers

  documentName = documentObj.displayName()

  iterator = (layer) => {
    let layerObj = layer.sketchObject

    if(layer.isShape) {
      let fillColor = layerObj.style().fills().firstObject().color().NSColorWithColorSpace(nil).hexValue().toString()
      colors.push("#" + fillColor)
    }
  }

  if(selection) {
    selection.iterate(layer => iterator(layer))

    if(colors.length > 1) {
      const results = colorable(colors, {compact: false, threshold: 0})
      const html = createHTML(results)
      const file = createFile(html)

      openFile(file)
      context.document.showMessage('HTML file created')
    } else {
      context.document.showMessage('Please choose more than 1 color to test')
    }
  }
}

createFile = (htmlStr) => {
  let htmlContent = NSString.stringWithString_(htmlStr)
  let filepath = NSTemporaryDirectory() + documentName + '.html'
  htmlContent.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(filepath, true)
  let file = NSURL.fileURLWithPath(filepath)

  return file
}

openFile = (file) => {
  NSWorkspace.sharedWorkspace().openFile(file.path())
}

createHTML = (result) => {
  let markup = table = ''
  const header = `
    <style>${readFile(PATH_TO_CSS)}</style>
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
    let aaStr = aaLargeStr = aaaStr = aaaLargeStr = ''

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

createColorBadge = (resultObj, x) => {
  return `
    <div class="badge" style="color: ${resultObj.hex}; background-color: ${resultObj.combinations[x].hex}">
      ${resultObj.combinations[x].hex}
    </div>
  `
}

createEmptyBadge = () => {
  return `
    <div class="badge">
      &nbsp;
    </div>
  `
}

readFile = (path) => {
  return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null)
}

isDark = (rgb) => {
	// YIQ equation from http://24ways.org/2010/calculating-color-contrast
	var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
	return yiq < 128
}
