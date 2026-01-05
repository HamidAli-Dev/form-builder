import { useState } from "react";
import FormBuilder from "./components/FormBuilder";
import FormPreview from "./components/FormPreview";

function App() {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [clearPreview, setClearPreview] = useState(false);

  return (
    <>
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold mb-8">Dynamic Form Builder</h1>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-7">
            <FormBuilder
              formName={formName}
              setFormName={setFormName}
              fields={fields}
              setFields={setFields}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              setClearPreview={setClearPreview}
            />
            <FormPreview
              formName={formName}
              fields={fields}
              clearPreview={clearPreview}
              setClearPreview={setClearPreview}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
