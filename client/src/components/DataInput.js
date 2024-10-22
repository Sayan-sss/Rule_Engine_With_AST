import React from "react";

const DataInput = ({ handleInputChange, evaluateRule }) => (
  <div className="flex flex-col">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">Input Data</h2>
    <input
      type="number"
      name="age"
      placeholder="Age"
      onChange={handleInputChange}
      className="mb-2 p-2 border border-gray-300 rounded"
    />
    <input
      type="text"
      name="department"
      placeholder="Department"
      onChange={handleInputChange}
      className="mb-2 p-2 border border-gray-300 rounded"
    />
    <input
      type="number"
      name="salary"
      placeholder="Salary"
      onChange={handleInputChange}
      className="mb-2 p-2 border border-gray-300 rounded"
    />
    <input
      type="number"
      name="experience"
      placeholder="Experience"
      onChange={handleInputChange}
      className="mb-4 p-2 border border-gray-300 rounded"
    />
    {/* <button
      onClick={evaluateRule}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    >
      Evaluate Rule
    </button> */}
  </div>
);

export default DataInput;
