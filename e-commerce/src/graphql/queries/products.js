import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
    query GetProducts {
        products {
            id
            name
            price
            category_id
        }
    }
`

export const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $price: numeric!, $category_id: Int!) {
    insert_products_one(object: { name: $name, price: $price, category_id: $category_id }) {
      id
      name
      price
      category_id
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $name: String!, $price: numeric!) {
    update_products_by_pk(pk_columns: {id: $id}, _set: {name: $name, price: $price}) {
      id
      name
      price
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    delete_products_by_pk(id: $id) {
      id
    }
  }
`