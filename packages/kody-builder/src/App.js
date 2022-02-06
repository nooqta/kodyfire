"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./App.css");
const examples_1 = require("@jsonforms/examples");
const material_renderers_1 = require("@jsonforms/material-renderers");
const react_2 = require("@jsonforms/react");
function App() {
    const schema = examples_1.person.schema;
    const uischema = examples_1.person.uischema;
    const initialData = examples_1.person.data;
    const [data, setData] = react_1.useState(initialData);
    return (jsx_runtime_1.jsx("div", Object.assign({ className: "App" }, { children: jsx_runtime_1.jsx(react_2.JsonForms, { schema: schema, uischema: uischema, data: data, renderers: material_renderers_1.materialRenderers, cells: material_renderers_1.materialCells, onChange: ({ data }) => setData(data) }, void 0) }), void 0));
}
exports.default = App;
//# sourceMappingURL=App.js.map