import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'


export default function Protector ({children}) {


    if(1==1){
        return children
    }else{


        
        return <Navigate to={"/login"}/>
    
    
    }
        
    

  
  return<>
  
  
  </> 


}
