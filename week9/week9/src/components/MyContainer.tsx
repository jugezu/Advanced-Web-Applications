import React, {useState} from "react";
import MyList, {type TItem}  from "./MyList";


function MyContainer(){
    const header: string = 'List'
    const [items, setItems]= useState<TItem[]>([
        {id: '1', text: 'this is first task', clicked: false},
        {id: '2', text: 'this is second task', clicked: false}
    ])

    const updateList = (id: string): void =>{
        setItems(items.map(item =>{
            if(item.id== id) {
                // Help with adding changing values in a list: https://react.dev/learn/updating-arrays-in-state 
                return{...item, clicked: !item.clicked }

            } else {
                return item
            }
        }))
 
    }

    const [content,setContent]=useState<string>("")
 
    const addItem = () =>{
        const newItem: TItem ={
            // id is set to next available number
            id: String(items.length+1),
            text: content,
            clicked: false
        }
        // Help with adding new items to the list: https://react.dev/learn/updating-arrays-in-state 
        setItems([...items, newItem])
        
        setContent("") //clean textarea
    }
    
    return(
        <div>
            <textarea id="textarea" placeholder="Add item" onChange={(e) => setContent(e.target.value)} value={content}/>
            <button onClick={addItem}>Add item</button>

            <MyList header={header} items={items} updateList={updateList}/>
        </div>


        
    )
}

export default MyContainer