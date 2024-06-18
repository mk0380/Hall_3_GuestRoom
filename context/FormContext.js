import { createContext, useState } from "react"

export const FormDetails = createContext();

const FormContext = ({children}) => {


    const [form, setForm] = useState({
        room_details:{
            room_no:"",
            room_type:"",
            arrival_date:"",
            departure_date:"",
            no_of_persons:0
        },
        visitor_details:{
            name:[],
            phone:[],
            relationship:[],
            purpose:""
        },
        indentor_details:{
            name:"",
            roll:"",
            email:"",
            phone:""
        }
    })

  return (
    <FormDetails.Provider value={{ form, setForm}}>
        {children}
    </FormDetails.Provider>
  )
}

export default FormContext