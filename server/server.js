const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sayanmondal0507:sayan@cluster0.wutei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define a Rule model
const ruleSchema = new mongoose.Schema({
  rule: { type: String, required: true },
  ast: { type: Object, required: true }, // Ensure it's an object type
});

const Rule = mongoose.model("Rule", ruleSchema);

// Function to parse the rule into AST (with improved error handling)
function parseRule(ruleStr) {
  try {
    // Tokenize the rule string, handling spaces around parentheses
    const tokens = ruleStr
      .replace(/\(/g, " ( ")
      .replace(/\)/g, " ) ")
      .split(" ")
      .filter((token) => token.trim());

    console.log("Tokens:", tokens); // Log tokens to verify the split

    // Function to parse individual expressions (like "age > 30")
    function parseExpression(tokens) {
      if (tokens.length >= 3) {
        const leftOperand = tokens[0]; // e.g., "age"
        const operator = tokens[1]; // e.g., ">"
        const rightOperand = tokens[2]; // e.g., "30" or "'Marketing'"

        // Map the operators to MongoDB-style syntax
        let mappedOperator;
        switch (operator) {
          case ">":
            mappedOperator = "$gt";
            break;
          case "<":
            mappedOperator = "$lt";
            break;
          case "=":
            mappedOperator = "$eq";
            break;
          default:
            throw new Error(`Unknown operator: ${operator}`);
        }

        // Handling if right operand is a number or string
        const rightValue = isNaN(rightOperand)
          ? rightOperand.replace(/['"]+/g, "") // Remove quotes if it's a string
          : Number(rightOperand);

        return {
          type: "condition",
          field: leftOperand, // e.g., "age"
          operator: mappedOperator, // e.g., "$gt"
          value: rightValue, // e.g., 30 or "Marketing"
        };
      }
      return null; // If it's not a valid expression
    }

    // Recursive function to parse the tokens into an AST
    // Recursive function to parse the tokens into an AST
    // Recursive function to parse the tokens into an AST
    function parse(tokens) {
      let token = tokens.shift(); // Get the first token

      if (token === "(") {
        // Start of a new nested expression
        const left = parse(tokens); // Parse the expression inside the parentheses
        const operator = tokens.shift(); // Expect an operator like "AND" or "OR"
        const right = parse(tokens); // Parse the right side of the operator
        tokens.shift(); // Consume the closing parenthesis ")"

        return {
          type: "operator",
          left,
          right,
          value: operator, // This will be "AND" or "OR"
        };
      } else if (token !== ")" && tokens.length >= 2) {
        // Parse as a condition if it's a valid expression
        const leftOperand = token;
        const operator = tokens.shift();
        const rightOperand = tokens.shift();

        return parseExpression([leftOperand, operator, rightOperand]); // Handle condition
      }

      throw new Error(`Unexpected token: ${token}`); // Throw error if invalid token is encountered
    }

    const ast = parse(tokens);

    console.log("Generated AST:", ast);
    // console.log("AST before evaluation:", JSON.stringify(rule.ast, null, 2));
    // Log the generated AST for debugging
    return ast;
  } catch (error) {
    console.error("Error while parsing rule:", error);
    throw new Error("Error parsing rule");
  }
}

// Function to evaluate the AST against provided data
const evaluateRule = (rule, data) => {
  console.log("Evaluating rule node:", JSON.stringify(rule, null, 2));

  if (rule.type === "operator") {
    if (rule.value === "AND") {
      const leftResult = evaluateRule(rule.left, data);
      const rightResult = evaluateRule(rule.right, data);
      console.log(`AND operation - Left: ${leftResult}, Right: ${rightResult}`);
      return leftResult && rightResult;
    } else if (rule.value === "OR") {
      const leftResult = evaluateRule(rule.left, data);
      const rightResult = evaluateRule(rule.right, data);
      console.log(`OR operation - Left: ${leftResult}, Right: ${rightResult}`);
      return leftResult || rightResult;
    }
  }

  if (rule.type === "condition") {
    const fieldValue = data[rule.field];
    let conditionResult = false;

    switch (rule.operator) {
      case "$gt":
        conditionResult = fieldValue > rule.value;
        break;
      case "$lt":
        conditionResult = fieldValue < rule.value;
        break;
      case "$eq":
        conditionResult = fieldValue === rule.value;
        break;
      default:
        throw new Error(`Unknown operator: ${rule.operator}`);
    }

    console.log(
      `Condition - Field: ${rule.field}, Value: ${fieldValue}, Operator: ${rule.operator}, Condition value: ${rule.value}, Result: ${conditionResult}`
    );
    return conditionResult;
  }

  return false; // If none of the conditions match
};

// Endpoint to create a rule
app.post("/create-rule", async (req, res) => {
  const { rule } = req.body;
  if (!rule) {
    return res.status(400).json({ error: "Rule string is required" });
  }

  try {
    const ast = parseRule(rule); // Parse the rule string into an AST
    if (!ast) {
      throw new Error("AST generation failed"); // Ensure AST is not null
    }
    const newRule = new Rule({ rule, ast }); // Attach the AST to the rule object
    await newRule.save();
    console.log("Rule created with AST:", newRule); // Log the newly created rule
    res.status(201).json(newRule);
  } catch (error) {
    console.error("Error during rule creation:", error); // Log the error
    res.status(500).json({ error: "Error creating rule" });
  }
});

// Endpoint to evaluate a rule
app.post("/evaluate-rule", async (req, res) => {
  const { ruleId, data } = req.body;

  if (!ruleId || !data) {
    return res.status(400).json({ error: "Missing ruleId or data" });
  }

  try {
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    const result = evaluateRule(rule.ast, data);
    res.json({ result });
  } catch (error) {
    console.error("Error evaluating rule:", error);
    res.status(500).json({ error: "Error evaluating rule" });
  }
});

// Endpoint to evaluate all rules
app.post("/evaluate-all-rules", async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res
      .status(400)
      .json({ error: "Data is required to evaluate rules" });
  }

  try {
    // Fetch all rules from the database
    const rules = await Rule.find();

    // Iterate through each rule and evaluate it
    for (let rule of rules) {
      const result = evaluateRule(rule.ast, data);

      // If any rule matches, return the rule and result
      if (result) {
        return res.json({
          message: "Data satisfies the rule",
          rule: rule.rule, // Return the rule as a string
          result: true,
        });
      }
    }

    // If no rules match, return false
    return res.json({
      message: "No rules matched the provided data",
      result: false,
    });
  } catch (error) {
    console.error("Error evaluating rules:", error);
    res.status(500).json({ error: "Error evaluating rules" });
  }
});

// Endpoint to fetch all rules
app.get("/api/rules", async (req, res) => {
  try {
    const rules = await Rule.find(); // Fetch all rules from the database
    res.json({ rules }); // Send the rules as a JSON response
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.status(500).json({ error: "Error fetching rules" });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
