import React from 'react'



const CustomInput = ({
    label,
    value,
    errors,
    onChange,
    onBlur,
    className='',
    ...props}) => {

  return (
    <div>
        
        <input 
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full p-3 border rounded-lg outline-none ${errors ? 'border-red-500' : ''} `}
            {...props}

        
        />
       {errors && <p className='error'>{errors} </p>} 

        
        
    </div>
  )
}

export default CustomInput