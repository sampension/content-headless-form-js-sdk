import './App.css';
import { useFetch } from './hooks/useFetch';
import Form from './components/Form';
import { extractParams } from './helpers/urlHelper';

function App() {
  const { relativePath, language } = extractParams(window.location.pathname)
  const url = `http://localhost:8000/api/React/GetFormInPageByUrl?url=${relativePath}`;
  const {data, loading} = useFetch(url);

  return (
    <div className="App">
      {loading && <div className='loading'>Loading...</div>}
      {!loading && data && (
          <>
            <h1>{data.title}</h1>
            {data.childrens.map((c: any) => (
              <Form formKey={c.reference.key} key={c.reference.key} language={language}/>
            ))}
          </>
      )}
    </div>
  );
}

export default App;
