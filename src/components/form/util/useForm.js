import React, {useState, useRef} from 'react';

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
  const fieldsRef = useRef({});
  const touchedFieldsRef = useRef({});
  const dirtyFieldsRef = useRef({});
  const errorsRef = useRef({});

  // recalculate the validity of the form after every new input is registered,
  // and on every value update
  const updateValidity = () => {
    // the criteria for form validity is that there are no errors
    // and that all required fields have had their change events fired at least once
    setValidity(
      Object.keys(fieldsRef.current).length === Object.keys(touchedFieldsRef.current).length &&
        Object.keys(errorsRef.current).every(key => !errorsRef.current[key])
    );
  };

  const register = input => {
    return (ref) => {
      if (!ref || !!(fieldsRef.current[input.name])) {
        return;
      }
      fieldsRef.current[input.name] = ref;
      if (!input.required) {
        touchedFieldsRef.current[input.name] = ref;
      }
      const validateAndUpdateErrors = ({target}) => {
        if (!target) {
          return;
        }

        if (input.validators) {
          errorsRef.current[input.name] =
            input.validators
              .map(validator => validator(target.value))
              .find(str => str);
          setErrors(errorsRef.current);
          updateValidity();
        }
      };

      fieldsRef.current[input.name].addEventListener('input', event => {
        touchedFieldsRef.current[input.name] = ref;
        if (input.name in dirtyFieldsRef.current) {
          validateAndUpdateErrors(event);
        } else {
          updateValidity();
        }
      });
      fieldsRef.current[input.name].addEventListener('blur', event => {
        dirtyFieldsRef.current[input.name] = ref;
        validateAndUpdateErrors(event);
      });

      updateValidity();
    };
  };

  const handleSubmit = (onSubmit) => {
    return (event) => {
      event.preventDefault();

      onSubmit(
        Object.keys(fieldsRef.current)
          .reduce((obj, key) => ({
            [key]: fieldsRef.current[key].value
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
