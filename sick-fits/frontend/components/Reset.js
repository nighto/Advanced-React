import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { data, error, loading }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    await reset().catch(console.error);
    resetForm();
  }

  console.log({ data, loading });

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Error error={error || successfulError} />
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Choose a New Password</h2>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success, you can now sign in</p>
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
        <label htmlFor="password">
          New Password
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={data?.createUser}>
          Save New Password
        </button>
      </fieldset>
    </Form>
  );
}
