import React, { useState, useEffect } from "react";
import FieldEditor from "./FieldEditor";

const FormBuilder = ({
  formName,
  setFormName,
  fields,
  setFields,
  selectedField,
  setSelectedField,
  setClearPreview,
}) => {
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    setSavedForms(forms);
  }, []);

  const loadForm = (form) => {
    setFormName(form.formData.formName);
    setFields(form.formData.fields);
    setSelectedField(null);
  };

  const deleteForm = (formId) => {
    if (
      confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      const updatedForms = savedForms.filter((form) => form.id !== formId);
      setSavedForms(updatedForms);
      localStorage.setItem("savedForms", JSON.stringify(updatedForms));
    }
  };

  const saveForm = () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }

    const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    const existingIndex = savedForms.findIndex(
      (form) => form.name === formName
    );

    const formToSave = {
      id:
        existingIndex >= 0
          ? savedForms[existingIndex].id
          : `form_${Date.now()}`,
      name: formName,
      fields: fields.length,
      createdAt:
        existingIndex >= 0
          ? savedForms[existingIndex].createdAt
          : new Date().toISOString(),
      formData: { formName, fields },
    };

    if (existingIndex >= 0) {
      savedForms[existingIndex] = formToSave;
    } else {
      savedForms.push(formToSave);
    }

    localStorage.setItem("savedForms", JSON.stringify(savedForms));
    setSavedForms(savedForms);
  };

  const clearForm = () => {
    if (
      confirm(
        "Are you sure you want to clear the form? This will remove all fields and reset the form name."
      )
    ) {
      setFormName("");
      setFields([]);
      setSelectedField(null);
      setClearPreview(true);
    }
  };
  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type} Field`,
      required: false,
      ...(type === 'select' && { options: ['Option 1', 'Option 2'] })
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const moveField = (dragIndex, hoverIndex) => {
    const draggedField = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    setFields(newFields);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex !== dropIndex) {
      moveField(dragIndex, dropIndex);
    }
  };
  return (
    <div className="rounded-xl backdrop-blur border border-gray-200 shadow-sm p-6 flex-1">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            ⚙️
          </span>
          Builder
        </h2>
        <div className="rounded-lg border border-gray-200 p-4 bg-white/60">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name/Title
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter form name..."
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-4 bg-white/60">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Field
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => addField("text")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm shadow-sm inline-flex items-center gap-2"
            >
              <span className="text-xl -ml-1">+</span>
              <span>Text Input</span>
            </button>
            <button
              onClick={() => addField("number")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm shadow-sm inline-flex items-center gap-2"
            >
              <span className="text-xl -ml-1">+</span>
              <span>Number</span>
            </button>
            <button
              onClick={() => addField("checkbox")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm shadow-sm inline-flex items-center gap-2"
            >
              <span className="text-xl -ml-1">+</span>
              <span>Checkbox</span>
            </button>
            <button
              onClick={() => addField("date")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm shadow-sm inline-flex items-center gap-2"
            >
              <span className="text-xl -ml-1">+</span>
              <span>Date Picker</span>
            </button>
            <button
              onClick={() => addField("select")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm shadow-sm inline-flex items-center gap-2"
            >
              <span className="text-xl -ml-1">+</span>
              <span>Dropdown/Select</span>
            </button>
          </div>
        </div>
        {fields.length > 0 && (
          <div className="rounded-lg border border-gray-200 p-4 bg-white/60">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fields
            </label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => setSelectedField(field)}
                  className={`p-2 border rounded cursor-move hover:bg-gray-50 ${
                    selectedField?.id === field.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{field.label}</span>
                    <span className="text-xs text-gray-500">{field.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedField && (
          <FieldEditor
            field={selectedField}
            setField={setSelectedField}
            fields={fields}
            setFields={setFields}
          />
        )}

        <div className="border-t pt-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Save &amp; Load Forms
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={saveForm}
                disabled={!formName.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <span>💾</span>Save Form
              </button>
              <button
                onClick={clearForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all active:scale-[0.99] flex items-center gap-2 shadow-sm"
              >
                <span>🗑️</span>Clear Form
              </button>
            </div>
            {savedForms.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Saved Forms ({savedForms.length})
                </h4>
                {savedForms.map((form) => (
                  <div
                    key={form.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{form.name}</h4>
                      <p className="text-sm text-gray-500">
                        {form.fields} fields
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadForm(form)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteForm(form.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 italic">
                No saved forms yet. Save your first form to see it here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
