import './App.css';
import { useFetch } from './hooks/useFetch';
import Form from './components/Form';

function App() {
  const url = `https://localhost:8081/api/React/GetFormInPageByUrl?url=${window.location.pathname}`;
  const {data, loading} = useFetch(url);

  return (
    <div className="App">
      {loading && <div className='loading'>Loading...</div>}
      {!loading && data && (
          <>
            <h1>{data.title}</h1>
            {data.childrens.map((c: any) => (
              <Form formKey={c.reference.key} key={c.reference.key}/>
            ))}
          </>
      )}
    </div>
  );
}

export default App;
