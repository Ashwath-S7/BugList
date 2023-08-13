import { gql } from "@apollo/client";

const ADD_BUG = gql`
  mutation AddBug($name: String!, $status: String!) {
    addBug(name: $name, status: $status) {
      id
      name
      status
    }
  }
`;

const UPDATE_BUG_STATUS = gql`
  mutation UpdateBugStatus($id: Int!, $status: String!) {
    updateBugStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const DELETE_BUG = gql`
  mutation DeleteBug($id: Int!) {
    deleteBug(id: $id)
  }
`;

export { ADD_BUG, UPDATE_BUG_STATUS, DELETE_BUG};