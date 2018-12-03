import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Router from 'next/router';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largerImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largerImage: $largerImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Coco',
    description: 'Hello',
    image: 'TESTTTTTTT',
    largerImage: 'TESTTTTTT',
    price: 1000
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error, called, data }) => (
          <Form
            onSubmit={async e => {
              //Stop form from submitting
              e.preventDefault();
              // Call the mutation
              const res = await createItem();
              // Change them to the single item page
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              });
              console.log(res);
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  onChange={this.handleChange}
                  value={this.state.title}
                  required
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  onChange={this.handleChange}
                  value={this.state.price}
                  required
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a Description"
                  onChange={this.handleChange}
                  value={this.state.description}
                  required
                />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
            <h2>Sell an Item</h2>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
