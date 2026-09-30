const fs = require('fs');
const path = require('path');

// Let's examine:
// main > div:nth-of-type(1)
// > div:nth-of-type(1)
// > div:nth-of-type(1)
// > div:nth-of-type(5)
// > div:nth-of-type(2)
// > div:nth-of-type(1)
// > div:nth-of-type(4)
// > div:nth-of-type(1)
// > div:nth-of-type(6)

// Let's check each tab in App.tsx:
const appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Find all occurrences of activeTab
const tabRegex = /\{activeTab === '([^']+)'[^}]*&& \(/g;
let match;
while ((match = tabRegex.exec(appCode)) !== null) {
  console.log('Tab:', match[1], 'at char', match.index);
}
