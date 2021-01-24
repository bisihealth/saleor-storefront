import gql from "graphql-tag";

import { basicProductFragment, productPricingFragment } from "@graphql";

import { TypedQuery } from "../../core/queries";
import { Category, CategoryVariables } from "./gqlTypes/Category";
import {
  CategoryProducts,
  CategoryProductsVariables,
} from "./gqlTypes/CategoryProducts";

export const categoryProductsDataQuery = gql`
  query Category($id: ID!, $channel: String) {
    category(id: $id) {
      seoDescription
      seoTitle
      id
      name
      backgroundImage {
        url
      }
      ancestors(last: 5) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    attributes(
      filter: {
        inCategory: $id
        filterableInStorefront: true
        channel: $channel
      }
      first: 100
    ) {
      edges {
        node {
          id
          name
          slug
          values {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const TypedCategoryProductsDataQuery = TypedQuery<
  Category,
  CategoryVariables
>(categoryProductsDataQuery);

export const categoryProductsQuery = gql`
  ${basicProductFragment}
  ${productPricingFragment}
  query CategoryProducts(
    $id: ID!
    $channel: String
    $attributes: [AttributeInput]
    $after: String
    $pageSize: Int
    $sortBy: ProductOrder
    $priceLte: Float
    $priceGte: Float
  ) {
    products(
      after: $after
      first: $pageSize
      sortBy: $sortBy
      filter: {
        attributes: $attributes
        categories: [$id]
        minimalPrice: { gte: $priceGte, lte: $priceLte }
        channel: $channel
      }
      channel: $channel
    ) {
      totalCount
      edges {
        node {
          ...BasicProductFields
          ...ProductPricingField
          category {
            id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const TypedCategoryProductsQuery = TypedQuery<
  CategoryProducts,
  CategoryProductsVariables
>(categoryProductsQuery);
