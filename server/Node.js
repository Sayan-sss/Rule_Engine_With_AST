// Node.js
class Node {
  constructor(type, left = null, right = null, operator = null, value = null) {
    this.type = type;
    this.left = left;
    this.right = right;
    this.operator = operator;
    this.value = value;
  }
}

module.exports = Node;
