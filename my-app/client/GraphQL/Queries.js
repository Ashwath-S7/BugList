import { gql } from "@apollo/client";

export const GET_BUGS = gql`
  query {
    bugs {
      id
      name
      status
    }
  }
`;