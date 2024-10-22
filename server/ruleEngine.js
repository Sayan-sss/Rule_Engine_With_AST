class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

function createRule(ruleString) {
  // Logic for creating AST from the rule string
}

function evaluateRule(data) {
  // Logic for evaluating rule based on AST and data
}

module.exports = { createRule, evaluateRule };
