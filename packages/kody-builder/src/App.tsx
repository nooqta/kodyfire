import { useState } from 'react';
import './App.css';
import { person } from '@jsonforms/examples';

import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';

import { JsonForms } from '@jsonforms/react';
function App() {
  const schema = person.schema;
  const uischema = person.uischema;
  const initialData = person.data;
  const [data, setData] = useState(initialData);
  return (
    <div className="App">
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
    </div>
  );
}

export default App;
