const fs = require('fs');
const path = require('path');

class BookIndexer {
  constructor() {
    this.pages = [];
    this.excludeWords = [];
    this.index = {};
  }

  readPages(directory) {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      this.pages.push(content);
    });
  }

  readExcludeWords(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    this.excludeWords = content.split('\n').map((word) => word.trim());
  }

  indexPages() {
    for (let i = 0; i < this.pages.length; i++) {
      const words = this.pages[i].split(/\W+/);
      for (let j = 0; j < words.length; j++) {
        const word = words[j].toLowerCase();
        if (!this.excludeWords.includes(word)) {
          if (!this.index[word]) {
            this.index[word] = new Set();
          }
          this.index[word].add(i + 1);
        }
      }
    }
  }

  generateIndexFile(outputPath) {
    const sortedWords = Object.keys(this.index).sort();
    let output = '';
    sortedWords.forEach((word) => {
      const pages = Array.from(this.index[word]).join(',');
      output += `${word} : ${pages}\n`;
    });
    fs.writeFileSync(outputPath, output, 'utf-8');
  }
}

// Usage example
const bookIndexer = new BookIndexer();
bookIndexer.readPages('./pages');
bookIndexer.readExcludeWords('./exclude-words.txt');
bookIndexer.indexPages();
bookIndexer.generateIndexFile('./index.txt');
