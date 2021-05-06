import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [signup, { data, error, loading }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refetch the currently logged in user
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    await signup().catch(console.error);
    resetForm();
  }

  console.log({ data, error, loading });

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a Password Reset</h2>
        {data?.sendUserPasswordResetLink === null && (
          <p>Code sent, if you supplied a valid email address.</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={data?.createUser}>
          Request Reset
        </button>
      </fieldset>
    </Form>
  );
}
