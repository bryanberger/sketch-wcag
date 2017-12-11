<div align="center">
  <img alt="sketch-wcag" src="/example-output.png" />
</div>

<div align="center">
  Sketch WCAG: A Sketch plugin that lets you contrast test your entire color palette against the WCAG guidelines all at once.
</div>

## Installation

##### Recommended

You can install the plugin from [Sketch Runner](http://sketchrunner.com) or [Sketchpacks](https://sketchpacks.com).

<a href="http://bit.ly/SketchRunnerWebsite">
  <img width="160" height="41" src="http://bit.ly/RunnerBadgeBlue">
</a>
<a href="https://sketchpacks.com/bryanberger/sketch-wcag/install">
  <img width="160" height="41" src="http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png">
</a>

##### Manually

Download [Sketch WCAG](https://github.com/bryanberger/sketch-wcag/archive/master.zip) and double-click the `.sketchplugin` to install.

## Usage

Select multiple `Shapes` with a fill and run this plugin by pressing `⇧⌘C` (*Shift + Command + C*) or via `Sketch Runner` to preview the WCAG guidelines in your browser. _(Currently: Doesn't work on symbols or groups, doesn't account for opacity)_

### AA requirements

Color contrast of **4.5:1** or **3:1 for large/bold text**

### AAA requirements

Color contrast of **7:1** or **4.5:1 for large/bold text**.

## Notes

- Large text is defined as 14 point (typically 18.66px) and bold or larger, or 18 point (typically 24px) or larger.
- aa - greater than 4.5 (for normal sized text)
- aaLarge - greater than 3 (for 14pt/18px+ bold text || for text larger than 18pt/24px)
- aaa - greater than 7
- aaaLarge - greater than 4.5 (for 14pt/18px+ bold text || for text larger than 18pt/24px)
- WCAG tests are run behind the scenes using [colorable](https://github.com/jxnblk/colorable)


## Contributing

Contributions are welcomed, [file a pull request](https://github.com/bryanberger/sketch-wcag/issues) or [an issue](https://github.com/bryanberger/sketch-wcag/pulls).
