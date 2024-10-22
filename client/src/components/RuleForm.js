import React from "react";

const RuleForm = ({ ruleString, handleRuleChange, createRule }) => (
  <div className="flex flex-col mb-4">
    <label className="text-gray-700 mb-2">
      Rule:
      <input
        type="text"
        value={ruleString}
        onChange={handleRuleChange}
        className="w-full p-2 border border-gray-300 rounded mt-1"
      />
    </label>
    <button
      onClick={createRule}
      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      Create Rule
    </button>
  </div>
);

export default RuleForm;
