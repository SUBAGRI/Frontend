import { findInputError, isFormInvalid } from './UtilsForm'
import { useFormContext } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { MdError } from 'react-icons/md'

export const Input = ({ label, type, name, value, placeholder, onChange, className, pattern }) => {
  const {
    register,
    formState: { errors }, 
  } = useFormContext() // useFormContext() is a hook from react-hook-form

  const inputError = findInputError(errors, name)
  const isInvalid = isFormInvalid(inputError)
  const marginBottom = isInvalid ? '0' : '5.25px';
  const color = label === undefined ? 'transparent' : ''; // Corrección aquí

  // Si no se proporciona una clase personalizada, utilizar la clase predeterminada
  className = className ? className : 'input is-medium';
  label = label ? label : 'transparent'; // Corrección aquí

  //Si no se proporciona pattern, se asigna un valor por defecto
  pattern = pattern ? pattern : '[0-9]*';

  return (
    <div className= "flex flex-col w-full gap-2">
      <div className="flex justify-between" style={{display: 'flex', justifyContent: 'space-between'}}>
        <label htmlFor={label} className="label is-small" style={{marginBottom, color}}>
          {label}
        </label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid &&(
            <InputError
              message={inputError.error.message}
              key={inputError.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      <input
        name={name} 
        type={type}
        className={className}
        value={value}
        placeholder={placeholder}
        pattern={pattern}
        {...register(name, {
          //Si onChange existe se le pasa el evento
           onChange: (e) => {onChange(e)},
            required: { 
              value: true,
              message: 'Obligatorio',
            },
            value: {
              value: value,
              message: 'value',
            },
          })}
      />
    </div>
  )
}
const errorTextStyle = {
    display: 'flex',
    alignItems: 'center', // Equivalente a flex items-center
    gap: '0.25rem', // Equivalente a gap-1
    paddingLeft: '0.5rem', // Equivalente a px-2
    paddingRight: '0.5rem', // Equivalente a px-2
    fontWeight: '600', // Equivalente a font-semibold
    color: '#EF4444', // Equivalente a text-red-500
    backgroundColor: '#FECACA', // Equivalente a bg-red-100
    borderRadius: '0.375rem', // Equivalente a rounded-md
    
  };

const InputError = ({ message }) => {
    return (
      <motion.p
        className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md"
        {...framer_error} 
        style={errorTextStyle}
      >
        <MdError />
        {message}
      </motion.p>
    )
  }
  
  const framer_error = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
  }