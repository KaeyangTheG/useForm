import React from 'react';
import useForm from './util/useForm';

export const Form = ({children}) => {
  const {errors, valid, handleSubmit, register} = useForm();
  
  const onSubmit = values => console.log(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {children}
      <label>
          First name
          <input
            name="firstName"
            type="text" 
            required
            ref={register({
              name: 'firstName',
              validators: [
                value => {
                  if (!value) {
                    return 'First name is required';
                  }
                  return '';
                },
                value => {
                  if (value.toLowerCase() === 'david') {
                    return 'Only I may be david';
                  }
                  return '';
                },
              ],
              required: true,
            })}
          />
          <div>{errors.firstName || ''}</div>
        </label>
        <button disabled={!valid}>Submit</button>
    </form>
  );
};