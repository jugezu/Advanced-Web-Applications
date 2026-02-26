
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css";
//https://www.npmjs.com/package/react-quill-new 
//https://github.com/VaguelySerious/react-quill?tab=readme-ov-file 


interface props{
  value: string
  onChange: (value:string)=>void
  onlyRead: boolean
}
function Editor({value, onChange, onlyRead}:props) {
  
  return(

    <div>
        <div style={{ marginTop: "20px" }}>
            <ReactQuill theme="snow" value={value} onChange={onChange} readOnly={onlyRead}/>
            
        </div>
    </div>
  )
}

export default Editor;
