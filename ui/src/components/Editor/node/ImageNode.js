import {
  DecoratorNode
} from 'lexical'

function ImageComponent(src) {
  const width = 600 

  return(
    <img style={{objectFit: 'contain'}} width={width} height='auto' src={src.src} alt='alt' />
  )
}

export class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src, key) {
    super(key);
    this.__src = src
  }

  createDOM(config) {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM() {
    return false;
  }

  setURL(src) {
    const writable = this.getWritable();
    writable.__src = src;
  }

  decorate(editor) {
    return <ImageComponent src={this.__src} />;
  }
}

export function $createImageNode(src) {
  return new ImageNode(src);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
