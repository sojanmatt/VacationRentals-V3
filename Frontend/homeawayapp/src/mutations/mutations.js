import { gql } from "apollo-boost";

const signupMutation = gql`
  mutation SignUp(
    $fname: String
    $lname: String
    $email: String
    $password: String
  ) {
    signup(fname: $fname, lname: $lname, email: $email, password: $password) {
      username
    }
  }
`;
const ownersignupMutation = gql`
  mutation ownersignupMutation(
    $fname: String
    $lname: String
    $email: String
    $password: String
  ) {
    ownersignup(
      fname: $fname
      lname: $lname
      email: $email
      password: $password
    ) {
      username
    }
  }
`;
const loginMutation = gql`
  mutation Login($username: String, $password: String) {
    login(name: $username, password: $password) {
      status
    }
  }
`;
const bookPropertyMutation = gql`
  mutation bookProperty(
    $prop_id: Int
    $fromDate: String
    $toDate: String
    $userId: String
  ) {
    bookProperty(
      prop_id: $prop_id
      fromDate: $fromDate
      toDate: $toDate
      userId: $userId
    ) {
      status
    }
  }
`;

const profileMutation = gql`
  mutation updateprofile(
    $school: String
    $city: String
    $aboutMe: String
    $company: String
    $hometown: String
    $languages: String
    $gender: String
    $username: String
  ) {
    updateprofile(
      school: $school
      city: $city
      aboutMe: $aboutMe
      company: $company
      hometown: $hometown
      languages: $languages
      gender: $gender
      username: $username
    ) {
      status
    }
  }
`;

export {
  signupMutation,
  loginMutation,
  bookPropertyMutation,
  profileMutation,
  ownersignupMutation
};
