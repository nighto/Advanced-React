import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import useForm from '../lib/useForm';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  // 1. Get the existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  // 2. Get the mutation to update the product
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION); // or use the variables here

  // 3. Create some state for the form inputs
  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);
  if (loading) return <p>Loading...</p>;

  // 4. We need the form to handle the updates
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const mutationPayload = {
          variables: {
            id,
            name: inputs.name,
            description: inputs.description,
            price: inputs.price,
          },
        };
        const res = await updateProduct(mutationPayload).catch(console.error);
      }}
    >
      <Head>
        <title>Sick Fits | Editing product "{data.Product.name}"</title>
      </Head>
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
