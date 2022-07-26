# ScratchFontCreationTool
![image](https://user-images.githubusercontent.com/76801340/180587789-ebe49ca7-e8e3-40bf-91dc-00b02c2f3ca7.png)
Effortlessly create costumes and kerning/widths values for stamp/clone text engines on Scratch.

## Installation
Download a release for your operating system, place a font file beside the executable, and run from the command line.
### [Windows](https://github.com/NTProgramsOfficial/ScratchFontCreationTool/releases/tag/windows-v1.0.0)
Run with `.\FontCreationTool.exe`
### [Linux](https://github.com/NTProgramsOfficial/ScratchFontCreationTool/releases/tag/linux-v1.0.0)
Run with `chmod +x FontCreationTool; ./FontCreationTool`
### [macOS (for Apple Silicon Macs)](https://github.com/NTProgramsOfficial/ScratchFontCreationTool/releases/tag/apple-macos-v1.0.0)
Run `chmod +x FontCreationTool`

Go to System Preferences → Security & Privacy and allow FontCreationTool.

Finally, run `./FontCreationTool`
### [macOS (for Intel Macs)](https://github.com/NTProgramsOfficial/ScratchFontCreationTool/releases/tag/intel-macos-v1.0.0)
Run with `chmod +x FontCreationTool`

Go to System Preferences → Security & Privacy and allow FontCreationTool.

Finally, run `./FontCreationTool`

## Usage
The app generates all the costumes for every character of the charset provided.

The kerning list stores how much each character has to move by based on the character before it, so there are a total of n×n combinations for each of the possible n×n character combination pairs.

You can access the kerning/width values by using this algorithm:
`(item ((previousChar-1)×n+currentChar) of kerning)×size`
where n is the length of the charset, previousChar and currentChar are the costume numbers of the previous and current character, and size is the size of the text. Note that you would have to adjust these values if the costumes don't start from the beginning.

## Dependencies
ScratchFontCreationTool wouldn't have been possible without these Node.js packages:
- opentype.js
- prompts
- pkg

## Build
1) Install Node.js from https://nodejs.org/
2) Build using: `npm install opentype.js prompts pkg; npx pkg FontCreationTool.js`

## To-do
1) Generate entire sprites rather than costumes
2) Replace the CLI with a web app
