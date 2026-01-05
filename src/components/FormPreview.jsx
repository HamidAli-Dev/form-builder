import React, { useState, useEffect } from "react";

const FormPreview = ({ formName, fields, clearPreview, setClearPreview }) => {
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (clearPreview) {
      setFormData({});
      setSubmittedData(null);
      setClearPreview(false);
    }
  }, [clearPreview, setClearPreview]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submission = {
      formName: formName || "Untitled Form",
      submittedAt: new Date().toISOString(),
      formId: `form_${Date.now()}`,
      data: {},
    };

    fields.forEach((field) => {
      submission.data[field.label] = {
        value: formData[field.id] || (field.type === "checkbox" ? false : ""),
        type: field.type,
        required: field.required,
      };
    });

    setSubmittedData(submission);

    // Save to localStorage
    const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    const formToSave = {
      id: submission.formId,
      name: submission.formName,
      fields: fields.length,
      createdAt: submission.submittedAt,
      formData: { formName, fields },
    };
    savedForms.push(formToSave);
    localStorage.setItem("savedForms", JSON.stringify(savedForms));
  };
  const renderField = (field) => {
    const value = formData[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text..."
            required={field.required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number..."
            required={field.required}
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={formData[field.id] || false}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            className="rounded focus:ring-2 focus:ring-blue-500"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">Select option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };
  return (
    <div className="rounded-xl backdrop-blur border border-gray-200 shadow-sm p-6 flex-1">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Form Preview</h2>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          {formName ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900">{formName}</h3>
              <div className="flex items-center gap-1">
                <p className="text-sm text-blue-700 mt-1">
                  {fields.length} fields
                </p>
                .
                <p className="text-sm text-blue-700 mt-1">
                  {fields.filter((field) => field.required).length} required
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Enter a form name to see it here
            </p>
          )}
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          {fields.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit Form
              </button>
            </form>
          ) : (
            <p className="text-gray-500 italic text-center py-4">
              No fields added yet. Add fields in the Form Builder to see the
              preview.
            </p>
          )}
        </div>
        {submittedData && (
          <div className="bg-linear-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Form Submitted Successfully
                </h3>
                <p className="text-sm text-gray-600">
                  Your form data has been captured
                </p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Submitted Form (JSON)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(submittedData, null, 2)
                      )
                    }
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setSubmittedData(null)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <pre className="text-sm text-green-400 font-mono leading-relaxed">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPreview;
