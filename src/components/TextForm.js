import React,{useState} from 'react'


export default function TextForm(props) {
  
  const handleUpClick=()=>{
   // console.log("UpperCase was clicked"+ text);
    let newText= text.toUpperCase();
    setText(newText);
    props.showAlert ("Converted to UpperCase!","success");
  }

  const handlelowClick=()=>{
    // console.log("UpperCase was clicked"+ text);
     let newText= text.toLowerCase();
     setText(newText);
    props.showAlert ("Converted to LowerCase!","success");

   }

   const clear=()=>{
    // console.log("UpperCase was clicked"+ text);
    
     setText('');
    props.showAlert ("Text Cleared!","success");

   }
    // const printtext=()=>{
    //  let newText= new window.print();
    //  newText.text=text;
    //  window.print.printtext(text);
    // }

   const speak = () => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
    props.showAlert ("Speaking!","success");

  }
  //It is targetted by the button 'speak':
  
  

  const handleOnChange=(event)=>{
   // console.log("Onchange");
    setText(event.target.value);
  }

  const Copy=()=>{     
     navigator.clipboard.writeText(text);
    props.showAlert ("Text Copied!","success");

   }

   const handleExtraSpaces=()=>{
    let newText = text.split(/[ ]+/); 
    setText(newText.join(" "));
    props.showAlert ("Extra Spaces Removed!","success");

   }

   

  
  const [text,setText] = useState('');
  
  return (
    <>
    <div className="container" style = {{color : props.mode==='dark'?'white':'black'}} >
        <h1 className='mb-4'>{props.heading}</h1>
        <div className="mb-3">           
        <textarea className='form-control' value ={text} onChange={handleOnChange} style = {{backgroundColor: props.mode==='dark'?'#13466e':'white' , color : props.mode==='dark'?'white':'black' }} id ="mybox" rows="8"></textarea>
        </div>
        <button disabled={text.length===0} className ="btn btn-primary mx-2 my-1" onClick={handleUpClick}>Convert to Uppercase</button>
        <button disabled={text.length===0} className ="btn btn-primary mx-2 my-1" onClick={handlelowClick}>Convert to lowercase</button>        
        <button disabled={text.length===0} className ="btn btn-primary mx-2 my-1" onClick={speak}>Speak</button>
        <button disabled={text.length===0} className ="btn btn-primary mx-2 my-1" onClick={clear}>Clear</button>
        <button disabled={text.length===0} className ="btn btn-primary mx-2 my-1" onClick={Copy}>Copy Text</button>
        <button disabled={text.length===0} className ="btn btn-primary mx-2 my-1" onClick={handleExtraSpaces}>Remove Extra Spaces</button>
       {/* <button className ="btn btn-primary mx-2" onClick={printtext}>Print</button>  */}
        
    </div>
    <div className='conatiner my-3' style = {{color : props.mode==='dark'?'white':'black'}}>
      <h2>Your Text summary</h2>
      <p> {text.split(/\s+/).filter((element)=>{return element.length!==0}).length} words and {text.length} characters</p>
      <p> {0.008 * text.split(" ").filter((element)=>{return element.length!==0}).length} Minutes read</p>
      <h3> Preview</h3>
      <p>{text.countWords>0?text:"Enter something to preview"}</p>
      </div>  
    </>
  )
}
