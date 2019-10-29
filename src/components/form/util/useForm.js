import React, {useState} from 'react';

const _fields = {};
const _touchedFields = {};
const _dirtyFields = {};
const _errors = {};

/*
 type input {
   name: string,
   ?validators: Array<(value: mixed) => string>,
   required: boolean,
 }
*/

export default () => {
  const [errors, setErrors] = useState({});
  const [valid, setValidity] = useState(true);

  // recalculate the validity of the form after every new input is registered,
  // and on every value update
  const updateValidity = () => {
    // the criteria for form validity is that there are no errors
    // and that all required fields have had their change events fired at least once
    setValidity(
      Object.keys(_fields).length === Object.keys(_touchedFields).length &&
        Object.keys(_errors).every(key => !_errors[key])
    );  
  };

  const register = input => {
    return (ref) => {
      if (!ref || !!(_fields[input.name])) {
        return;
      }
      _fields[input.name] = ref;
      if (!input.required) {
        _touchedFields[input.name] = ref;
      }
      const validateAndUpdateErrors = ({target}) => {
        if (!target) {
          return;
        }

        if (input.validators) {
          _errors[input.name] = 
            input.validators
              .map(validator => validator(target.value))
              .find(str => str);
          setErrors(_errors);
          updateValidity();
        }
      };

      _fields[input.name].addEventListener('input', event => {
        _touchedFields[input.name] = ref;
        if (input.name in _dirtyFields) {
          validateAndUpdateErrors(event);
        }
      });
      _fields[input.name].addEventListener('blur', event => {
        _dirtyFields[input.name] = ref;
        validateAndUpdateErrors(event);
      });

      updateValidity();
    };
  };

  const handleSubmit = (onSubmit) => {
    return (event) => {
      event.preventDefault();
      
      onSubmit(
        Object.keys(_fields)
          .reduce(key => ({
            [key]: _fields[key].value
          }), {})
      );
    };
  };

  return {
    register,
    handleSubmit,
    errors,
    valid,
  };
};