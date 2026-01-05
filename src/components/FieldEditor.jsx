import React from "react";

const FieldEditor = ({ field, setField, fields, setFields }) => {
  const updateField = (key, value) => {
    const updatedField = { ...field, [key]: value };
    setField(updatedField);
    setFields(fields.map((f) => (f.id === field.id ? updatedField : f)));
  };

  const updateOption = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    updateField('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
    updateField('options', newOptions);
  };

  const removeOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    updateField('options', newOptions);
  };

  const deleteField = () => {
    setFields(fields.filter((f) => f.id !== field.id));
    setField(null);
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 p-4 bg-white/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Field Configuration
          </h3>
          <button
            onClick={deleteField}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField("label", e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField("required", e.target.checked)}
              className="rounded"
            />
            <label className="text-xs text-gray-600">Required field</label>
          </div>
          {field.type === 'select' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Options</label>
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeOption(index)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FieldEditor;
