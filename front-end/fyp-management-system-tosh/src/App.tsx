import { useState } from 'react'
import './App.css'

const title = 'Kontol Aric';
const subjects: string[] = ['Aric Kontol', 'Jembut Aric', 'Aric Kontol Kontol', 'Aric anjinggg ?'];
let x = 0;
function App() {
  
  const [subject, setSubject] = useState(subjects[x]);
  const handleClick = () => {
    console.log(x);
    if(x < subjects.length - 1) {
      setSubject(subjects[++x]);
    } else {
      setSubject(subjects[x = 0]);
    }
  };

  return (
    <>
      <h1>{title}</h1>
      <p>I like {subject}</p>
      <button onClick={handleClick}>Click me!</button>
    </>
  )
}

export default App
