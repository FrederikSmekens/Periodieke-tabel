"use strict"

export class Element {
  #name;
  #xpos;
  #ypos;
  #symbol;
  #number;
  #bgColor;
  #glbFile;
  #summary;
  #source;
  #image;

  constructor(name, xpos, ypos, symbol, number, bgcolor, glbfile, summary, source, image) {
      this.#name = name;
      this.#xpos = xpos;
      this.#ypos = ypos;
      this.#symbol = symbol;
      this.#number = number;
      this.#bgColor = bgcolor;
      this.#glbFile = glbfile;
      this.#summary = summary;
      this.#source = source;
      this.#image = image;
  }
  getName() {
      return this.#name;
  }
  getXPos() {
      return this.#xpos;
  }
  getYPos() {
      return this.#ypos;
  }
  getSymbol() {
      return this.#symbol;
  }
  getNumber() {
      return this.#number;
  }
  getBgColor() {
      return this.#bgColor;
  }
  getGLBFile() {
      return this.#glbFile;
  }
  getSummary() {
      return this.#summary;
  }
  getSource() {
      return this.#source;
  }
  getImage(){
    return this.#image;
  }
}