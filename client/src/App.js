import React, { useState, useEffect } from "react";
import RuleForm from "./components/RuleForm";
import DataInput from "./components/DataInput";
import axios from "axios";
import "./App.css";

function App() {
  const [ruleString, setRuleString] = useState("");
  const [data, setData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: "",
  });
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const handleRuleChange = (e) => setRuleString(e.target.value);
  const handleInputChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const fetchRules = async () => {
    try {
      const response = await axios.get(
        "https://rule-engine-with-ast-backend-i6qj.onrender.com/api/rules"
      );
      console.log("Fetched rules:", response.data.rules); // Log the response
      setRules(response.data.rules);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const createRule = async () => {
    if (!ruleString) {
      setMessage("Please enter a rule before creating.");
      return;
    }

    try {
      console.log(JSON.stringify(data));
      await axios.post("https://rule-engine-with-ast-backend-i6qj.onrender.com/create-rule", {
        rule: ruleString,
      });
      setMessage("Rule created successfully!");
      fetchRules(); // Refresh the rules list after creating a new rule
    } catch (error) {
      console.error("Error creating rule:", error);
      setMessage("Error creating rule. Please try again.");
    }
  };

  const evaluateSingleRule = async () => {
    if (!selectedRuleId) {
      setMessage("Please select a rule to evaluate.");
      return;
    }

    try {
      const response = await axios.post(
        "https://rule-engine-with-ast-backend-i6qj.onrender.com/evaluate-rule", 
        {
          ruleId: selectedRuleId,
          data: {
            age: isNaN(parseInt(data.age, 10)) ? null : parseInt(data.age, 10),
            department: data.department || null,
            salary: isNaN(parseInt(data.salary, 10))
              ? null
              : parseInt(data.salary, 10),
            experience: isNaN(parseInt(data.experience, 10))
              ? null
              : parseInt(data.experience, 10),
          },
        }
      );
      setResult(response.data.result);
      setMessage("Rule evaluated successfully!");
    } catch (error) {
      console.error("Error evaluating rule:", error);
      setMessage("Error evaluating rule. Please try again.");
    }
  };

  async function evaluateAllRules(data) {
    try {
      const response = await fetch(
       "https://rule-engine-with-ast-backend-i6qj.onrender.com/evaluate-all-rules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        }
      );

      const result = await response.json();

      if (result.result) {
        setResult(true);
        setMessage(`Data matches the rule: ${result.rule}`);
      } else {
        setResult(false);
        setMessage("No rules matched the provided data.");
      }
    } catch (error) {
      console.error("Error evaluating rules:", error);
      setMessage("Error evaluating rules. Please try again.");
    }
  }

  const handleRuleSelection = (id) => {
    setSelectedRuleId(id); // Only update the selected rule ID, no need to set a message
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Rule Engine Application
      </h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
        <RuleForm
          ruleString={ruleString}
          handleRuleChange={handleRuleChange}
          createRule={createRule}
        />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <DataInput handleInputChange={handleInputChange} />
        <div className="flex justify-between mt-4">
          <button
            onClick={evaluateSingleRule}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Evaluate Single Rule
          </button>
          <button
            onClick={() => evaluateAllRules(data)} // Pass the actual 'data' state here
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Evaluate All Rules
          </button>
        </div>
      </div>
      {message && (
        <div className="mt-4 bg-green-100 text-green-700 p-2 rounded">
          <p>{message}</p>
        </div>
      )}
      {result !== null && (
        <div className="mt-6">
          {Array.isArray(result) ? (
            <div>
              <h3 className="text-2xl font-semibold">Results for All Rules:</h3>
              <ul>
                {result.map((res, index) => (
                  <li
                    key={index}
                    className={`mt-2 ${
                      res ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Rule {index + 1}: {res ? "True" : "False"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <h3
              className={`text-2xl font-semibold ${
                result ? "text-green-600" : "text-red-600"
              }`}
            >
              Evaluation Result: {result ? "True" : "False"}
            </h3>
          )}
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Created Rules</h2>
        {rules.length > 0 ? (
          <ul>
            {rules.map((ruleObj) => (
              <li
                key={ruleObj._id}
                className={`mb-2 p-2 cursor-pointer rounded ${
                  selectedRuleId === ruleObj._id ? "bg-green-200" : "bg-gray-50"
                }`}
                onClick={() => handleRuleSelection(ruleObj._id)}
              >
                <strong>Rule:</strong> {ruleObj.rule}
              </li>
            ))}
          </ul>
        ) : (
          <p>No rules created yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
