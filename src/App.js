import React ,{ useState } from 'react';
import './App.css';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import About from './components/About';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from "react-router-dom";


function App() {
  const [mode, setMode] = useState('light');
  const [alert, setAlert] = useState(null);
  
  const showAlert =(message,type) =>{
    setAlert({
      msg :message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  
  const removeBodyClasses=()=>{
    document.body.classList.remove('bg-light')
    document.body.classList.remove('bg-dark')
    document.body.classList.remove('bg-warning')
    document.body.classList.remove('bg-success')
    document.body.classList.remove('bg-danger')
  }
  
  const toggleMode = (cls)=>{
    removeBodyClasses();
    console.log(cls)
    document.body.classList.add('bg-'+cls)
    if(mode === 'light'){
      setMode ( 'dark');
      document.body.style.backgroundColor = 'grey'
      showAlert("Dark mode has been enabled", "success")
      // setInterval(() => {
      //   document.title= "textLab is amazing"
      // }, 1000);
      // setInterval(() => {
      //   document.title= "Install textLab now"
      // }, 1500);
    }
    else{
      setMode ( 'light');
      document.body.style.backgroundColor = 'white'
      showAlert("Light mode has been enabled", "success")

    }
  }
  return ( 
    <>  
   <Router> 
  <Navbar title = "TextLab" mode={mode} toggleMode={toggleMode}/>
  <Alert alert ={alert}/>
  <div className="container my-3">
  <Routes>
        {/*  exact used to find the exact path bcz react can give another path with same first name */}
        <Route exact path="/" element={<TextForm showAlert={showAlert} heading ="Try TextLab - Word Counter , Character Counter,Remove Extra Spaces" mode={mode}/>} />
        <Route exact path="/about" element={<About mode={mode}/>}></Route>   
  </Routes>
  
  </div>

 </Router> 
  
    </>
  );
}

export default App;
