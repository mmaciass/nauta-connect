import * as yup from 'yup';

const schemaValidation = yup.object({
  username: yup.string().required('Este campo es obligatorio.').email('Este campo no coincide con una cuenta valida.')
    .test('only-numbers', 'Este campo no coincide con una cuenta valida.',
      (value) => {
        return !!value && !!value.split('@')[1]
          && (value.split('@')[1] === 'nauta.com.cu' || value.split('@')[1] === 'nauta.co.cu');
      },
    ),
  password: yup.string().required('Este campo es obligatorio.'),
  remember: yup.boolean(),
});

export default schemaValidation;