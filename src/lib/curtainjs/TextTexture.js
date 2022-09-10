/***
 Helper class to create text textures easily with curtains.js
 Supports:
    - vertical and horizontal text alignements
    - lowercase and uppercase
    - filled or stroked text

 Does not support:
    - right to left text (TODO)
    - custom letter spacing

 params:
 @plane (curtains.js Plane object): curtains.js plane that will use that texture.
 @textElement (HTML element, optional): An HTML element containing the text to use. Default to the associated plane HTML element.
 @skipFontLoading (bool, optional): Whether to skip the font loading check (in case you handle that logic elsewhere in your code). Default to false.
 @verticalAlign (string, optional): Vertical text alignment. Accepts "top", "center" or "bottom". Default to "top".
 @allowedLineEndSpace (float, optional): What additional space to add at the end of line to check if a word can fit. Default to 0.5.
 @fillType (string, optional): Fill type used to draw the text. Accpets "fill" or "stroke". Default to "fill".
 @sampler (string, optional): The texture sampler's name that will be used in the shaders.
 @texturesOptions (object, optional): Options/parameters to apply to the WebGL texture. See curtains.js texture documentation.
 @resolution (float, optional): Resolution of the canvas used to render the text. The bigger the better result, at the expense of a bigger performance impact. Default to 1.

 @onBeforeWordMeasuring (function, optional): Callback called before measuring the size each word of the text element. Use it if you want to make some changes to your text that might affect its layout.
 @onAfterWordMeasuring (function, optional): Callback called after measuring the size each word of the text element. Use it if you made some changes to your text that might have affected its layout.
 @onBeforeWordWriting (function, optional): Callback called before writing each word of the text element to the canvas. Use it if you want to make some changes to your text like change its color or underline it.
 @onAfterWordWriting (function, optional): Callback called after writing each word of the text element to the canvas. Use it if you made some changes to your text like changed its color or underlined it and want to restore the default values.


 Usage:

 const textTexture = new TextTexture({
    plane: plane,
    textElement: plane.htmlElement,
    sampler: "uTexture",
    skipFontLoading: true, // meaning we've already loaded the font earlier in our app
    resolution: 1.5,
    texturesOptions: {
        // pass some textures options if needed
    },
    onBeforeWordWriting: (ctx, wordInfos, boundingRect) => {
        if(wordInfos.word === "underlined") {
            // underline the word "underlined" in the text
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(boundingRect.left, boundingRect.bottom - 1);
            ctx.lineTo(boundingRect.right, boundingRect.bottom - 1);
            ctx.stroke();
        }
    }
});

 ***/


export class TextTexture {
    constructor({
        plane,
        textElement,
        skipFontLoading = false,
        verticalAlign = "top",
        allowedLineEndSpace = 0.5,
        fillType = "fill",
        sampler = "uTextTexture",
        texturesOptions = {},
        resolution = 1,

        // callbacks
        onBeforeWordMeasuring = () => {},
        onAfterWordMeasuring = () => {},
        onBeforeWordWriting = () => {},
        onAfterWordWriting = () => {},
    } = {}) {
        const acceptedTypes = ["Plane", "PingPongPlane", "ShaderPass"];

        if(!plane || !plane.type || !acceptedTypes.find(type => type === plane.type)) {
            console.error("TextTexture: can't be created without a plane");
            return;
        }

        if(!plane.gl) {
            console.error("TextTexture: can't be created because the WebGL context is undefined");
            return;
        }

        this.plane = plane;
        
        if(!textElement) {
            textElement = this.plane.hmltElement;
        }

        this.textElement = textElement;
        this.resolution = resolution;
        this.skipFontLoading = skipFontLoading;
        this.allowedLineEndSpace = allowedLineEndSpace;

        this.onBeforeWordMeasuring = onBeforeWordMeasuring;
        this.onAfterWordMeasuring = onAfterWordMeasuring;
        this.onBeforeWordWriting = onBeforeWordWriting;
        this.onAfterWordWriting = onAfterWordWriting;

        this.content = {
            verticalAlign: verticalAlign,
            text: this.textElement.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim() // trim text content
        };

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        // get text style
        this.content.style = window.getComputedStyle(this.textElement);
        this.content.style.fillType = fillType !== "fill" && fillType !== "stroke" ? "fill" : fillType;

        this.setCanvasSize();
        this.setWords();
        this.loadFont();

        texturesOptions = Object.assign(texturesOptions, {sampler: sampler});

        this.plane.loadCanvas(this.canvas, texturesOptions, (texture) => {
            this.texture = texture;
            this.texture.shouldUpdate = false;

            if(this.content.fontLoaded && !this.content.firstWrite) {
                this.writeTexture();
            }
        });

        // override plane's default onAfterResize callback
        this.plane._onAfterResizeCallback = () => {
            this._onAfterResizeCallback && this._onAfterResizeCallback();
            this.resize();
        };

        this.plane.onAfterResize = (callback) => {
            if(callback) {
                this._onAfterResizeCallback = callback;
            }
            return this.plane;
        }
    }


    /***
     Sets our canvas element sizes and scales
     ***/
    setCanvasSize() {
        this.pixelRatio = this.plane.renderer.pixelRatio;

        const planeBBox = this.plane.getBoundingRect();

        // set sizes
        this.canvas.width = planeBBox.width * this.resolution;
        this.canvas.height = planeBBox.height * this.resolution;

        this.context.width = planeBBox.width;
        this.context.height = planeBBox.height;

        this.context.scale(this.resolution, this.resolution);

        this.content.boundingRect = this.textElement.getBoundingClientRect();


        this.content.innerBoundingRect = {
            width: this.content.boundingRect.width - parseFloat(this.content.style.paddingLeft) - parseFloat(this.content.style.paddingRight),
            height: this.content.boundingRect.height - parseFloat(this.content.style.paddingTop) - parseFloat(this.content.style.paddingBottom),
            top: parseFloat(this.content.style.paddingTop) + (this.content.boundingRect.top - planeBBox.top / this.pixelRatio),
            left: parseFloat(this.content.style.paddingLeft) + (this.content.boundingRect.left - planeBBox.left / this.pixelRatio),
        };

        this.content.innerBoundingRect.right = this.content.innerBoundingRect.left + this.content.innerBoundingRect.width;
        this.content.innerBoundingRect.bottom = this.content.innerBoundingRect.top + this.content.innerBoundingRect.height;

        // multiply by pixel ratio
        this.content.innerBoundingRect.width *= this.pixelRatio;
        this.content.innerBoundingRect.height *= this.pixelRatio;
        this.content.innerBoundingRect.top *= this.pixelRatio;
        this.content.innerBoundingRect.left *= this.pixelRatio;
        this.content.innerBoundingRect.right *= this.pixelRatio;
        this.content.innerBoundingRect.bottom *= this.pixelRatio;
    }


    /***
     Create an array with all the words contained in the text element, split by white spaces and "-"
     ***/
    setWords() {
        this.content.words = [];

        // we're going to split words by "-" because it can cause line breaks
        const separatedWords = this.content.text.split("-");
        const words = [];

        const wordsLength = separatedWords.length;
        separatedWords.forEach((word, index) => {
            if(index < wordsLength - 1) {
                words.push(word);
                words.push("-");
            }
            else {
                words.push(word);
            }
        });

        // now split text by spaces
        words.forEach(word => {
            const splittedWords = word.split(" ");
            splittedWords.forEach((w, index) => {
                // no space before and after "-" elements
                this.content.words.push({
                    word: w,
                    spaceAfter: !(w === "-" || index === splittedWords.length - 1 || w === ""),
                });
            });
        });
    }


    /***
     Load the font if necessary and the write our text to the canvas if everything's ready
     ***/
    loadFont() {
        if(!this.skipFontLoading) {
            // wait for the font to be loaded
            document.fonts.load(this.content.style.fontStyle + " " + this.content.style.fontWeight + " 1em " + this.content.style.fontFamily).then(() => {
                this.content.fontLoaded = true;

                if(this.texture && !this.content.firstWrite) {
                    // resize the plane because its dimensions might have changed
                    // if it has been created before the actual font has been loaded
                    this.plane.resize();

                    this.writeTexture();
                }
            });
        }
        else {
            this.content.fontLoaded = true;
        }
    }

    /***
     Measure (if needed) then write our text to the canvas

     params:
     @measureText (bool, optional): whether to measure the text or skip this step. Default to true.
     ***/
    writeTexture(measureText = true) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // we're going to build an array of each lines first
        // then we'll write those lines with the correct vertical/horizontal alignment on the canvas

        // first, apply the correct styles
        this.context.fillStyle = this.content.style.color;
        this.context.strokeStyle = this.content.style.color;

        this.context.font = this.content.style.fontStyle + " " + this.content.style.fontWeight + " " + parseFloat(this.content.style.fontSize) * this.plane.renderer.pixelRatio + "px " + this.content.style.fontFamily;

        this.context.lineHeight = this.content.style.lineHeight;

        const startingPos = this.content.innerBoundingRect.left ;

        const lineHeight = parseFloat(this.content.style.lineHeight) * this.pixelRatio;
        const fontSize = parseFloat(this.content.style.fontSize) * this.pixelRatio;

        const spaceWidth = this.context.measureText(" ").width;

        // start at the right position
        this.context.textBaseline = "top";

        // top position needs to be adjusted based on line height and font size
        const lineHeightRatio = lineHeight / fontSize;
        let adjustTopPos = fontSize * 0.1 + (lineHeightRatio - 1) * fontSize * 0.5;

        // safari seems to handle this differently!
        if(navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
            adjustTopPos = (lineHeightRatio - 1.4) * fontSize / 2;
        }

        const position = {
            x: startingPos,
            y: this.content.innerBoundingRect.top + adjustTopPos,
        };

        // now build our lines
        if(measureText || !this.lines) {
            this.lines = [];

            this.content.words.forEach((w, i) => {
                if(this.content.style.textTransform === "uppercase") {
                    w.word = w.word.toUpperCase();
                }
                else if(this.content.style.textTransform === "lowercase") {
                    w.word = w.word.toLowerCase();
                }

                this.onBeforeWordMeasuring && this.onBeforeWordMeasuring(this.context, w, i);

                // get the width of current word
                const wordWidth = this.context.measureText(w.word).width;

                this.onAfterWordMeasuring && this.onAfterWordMeasuring(this.context, w, i);


                if(i > 0 && position.x + wordWidth > (this.content.innerBoundingRect.width + this.content.innerBoundingRect.left) + spaceWidth * this.allowedLineEndSpace || w.word === "") {
                    position.x = startingPos;
                    position.y += lineHeight;
                }

                // new line
                if(position.x === startingPos) {
                    this.lines.push([]);
                }

                const line = this.lines[this.lines.length - 1];

                line.push({
                    word: w.word,
                    wordWidth: wordWidth,
                    position: {
                        x: position.x,
                        y: position.y,
                    },
                    spaceAfter: w.spaceAfter
                });

                // update x position to next word
                position.x += wordWidth;

                // add a space after the word if needed
                if(w.spaceAfter) {
                    position.x += spaceWidth;
                }
            });
        }

        // now we're gonna write the text on the canvas

        // handling vertical and horizontal text align
        const offset = {
            x: 0,
            y: 0,
        };

        // vertical alignment is handled using the whole block size
        const totalHeight = this.lines[0][0].position.y + this.lines[this.lines.length - 1][0].position.y + fontSize;

        if(this.content.verticalAlign === "center") {
            offset.y = (this.content.innerBoundingRect.height - totalHeight) * 0.5 - adjustTopPos * 0.5;
        }
        else if(this.content.verticalAlign === "bottom") {
            offset.y = this.content.innerBoundingRect.height - totalHeight + adjustTopPos * 0.5;
        }

        // write each lines
        this.lines.forEach((line, index) => {
            line.forEach(word => {
                // horizontal alignment is handled lines by lines
                const lineWidth = line[0].position.x + line[line.length - 1].position.x + line[line.length - 1].wordWidth - startingPos;

                if(this.content.style.textAlign === "right" || this.content.style.textAlign === "end") {
                    offset.x = this.content.innerBoundingRect.right - lineWidth;
                }
                else if(this.content.style.textAlign === "center") {
                    offset.x = (this.content.innerBoundingRect.right - lineWidth) / 2;
                }

                if(this.onBeforeWordWriting) {
                    this.onBeforeWordWriting(
                        this.context,
                        word,
                        {
                            left: word.position.x + offset.x,
                            top: word.position.y + offset.y,
                            right: word.position.x + offset.x + word.wordWidth,
                            bottom: word.position.y + offset.y + fontSize,
                        },
                        this.content.style,
                        index
                    );
                }

                // write the text
                if(this.content.style.fillType === "stroke") {
                    this.context.miterLimit = 2;
                    this.context.strokeText(word.word, word.position.x + offset.x, word.position.y + offset.y);
                }
                else {
                    this.context.fillText(word.word, word.position.x + offset.x, word.position.y + offset.y);
                }

                this.onAfterWordWriting && this.onAfterWordWriting(this.context, word, offset, this.content.style, index);
            });
        });

        // resize our texture and upload it again to our GPU
        if(measureText) {
            this.texture.resize();
        }

        // update the texture to send the newly written canvas to the GPU
        this.texture.needUpdate();

        // flag that indicate that we have made our first texture write
        this.content.firstWrite = true;
    }


    /***
     Resize the canvas and write the texture again (internally called right after the plane object has been resized)
     ***/
    resize() {
        if(this.texture) {
            this.setCanvasSize();
            this.writeTexture();
        }
    }


    /*** DESTROYING ***/

    /***
     Cleanly dispose our TextTexture object
     Call it after you have removed your plane object
     ***/
    dispose() {
        this.content = {};
        this.textElement = null;
        this.plane = null;
        this.texture = null;
    }
}