import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import './App.css';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
});

const initialData = {};

const renderers = [
  ...materialRenderers,
  //register custom renderers
  // { tester: ratingControlTester, renderer: RatingControl },
];

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState(initialData);
  const [schema, setSchema] = useState({});
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
  useEffect(() => {
    fetch('/api/kodies')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          fetch('/api/kodies/' + data[0].name)
            .then(res => res.json())
            .then(schema => {
              setSchema(schema);
            });
        }
      });
  }, []);
  const clearData = () => {
    setData({});
  };

  const handleDataChange = () => {
    fetch('/api/kodies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
      });
  };

  return (
    <Fragment>
      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
      >
        {/* <Grid item sm={6}>
          <Typography variant={'h4'} className={classes.title}>
            Bound data
          </Typography>
          <div className={classes.dataContent}>
            <pre id='boundData'>{stringifiedData}</pre>
          </div>
          <Button
            className={classes.resetButton}
            onClick={clearData}
            color='primary'
            variant='contained'
          >
            Clear data
          </Button>
        </Grid> */}
        <Grid item sm={12}>
          <Typography variant={'h4'} className={classes.title}>
            Kodyfire Builder
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={schema}
              // uischema={uischema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setData(data)}
            />
          </div>
          <Button
            className={classes.resetButton}
            onClick={handleDataChange}
            color="primary"
            variant="contained"
          >
            Generate
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
