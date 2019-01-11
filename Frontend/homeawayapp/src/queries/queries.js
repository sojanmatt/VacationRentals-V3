import { gql } from "apollo-boost";

const loginQuery = gql`
  query Login($username: String, $password: String) {
    login(name: $username, password: $password) {
      username
    }
  }
`;

const ownerloginQuery = gql`
  query Login($username: String, $password: String) {
    ownerlogin(name: $username, password: $password) {
      username
    }
  }
`;

const searchQuery = gql`
  query search($location: String, $fromDate: String, $toDate: String) {
    search(location: $location, fromDate: $fromDate, toDate: $toDate) {
      prop_id
      headline
      type
      location
      bed
      bath
      startdate
      enddate
      currencytype
      rate
      minstay
      maxadults
      maxchild
      description
      unit
      city
      state
      zip
      country
      address
    }
  }
`;
const selectedPropertyQuery = gql`
  query selectedproperty($prop_id: Int) {
    selectedproperty(prop_id: $prop_id) {
      prop_id
      headline
      type
      location
      bed
      bath
      startdate
      enddate
      currencytype
      rate
      minstay
      maxadults
      maxchild
      description
      unit
      city
      state
      zip
      country
      address
    }
  }
`;
const latestBookingQuery = gql`
  query latestbooking($username: String) {
    latestbooking(username: $username) {
      fromDate
      toDate
      properties {
        prop_id
        headline
        type
        location
        bed
        bath
        startdate
        enddate
        currencytype
        rate
        minstay
        maxadults
        maxchild
        description
        unit
        city
        state
        zip
        country
        address
      }
    }
  }
`;
const ownerDashboardQuery = gql`
  query ownerdashboard($username: String) {
    ownerdashboard(username: $username) {
      properties {
        prop_id
        headline
        type
        location
        bed
        bath
        startdate
        enddate
        currencytype
        rate
        minstay
        maxadults
        maxchild
        description
        unit
        city
        state
        zip
        country
        address
      }
    }
  }
`;
const profileQuery = gql`
  query getprofile($username: String) {
    getprofile(username: $username) {
      username
      password
      Fname
      Lname
      school
      phone
      aboutMe
      company
      city
      hometown
      languages
      gender
      isTraveler
      isOwner
    }
  }
`;
export {
  loginQuery,
  ownerloginQuery,
  searchQuery,
  selectedPropertyQuery,
  latestBookingQuery,
  profileQuery,
  ownerDashboardQuery
};
// prop_id
// headline
// type
// location
// bed
// bath
// startdate
// enddate
// currencytype
// rate
// minstay
// maxadults
// maxchild
// description
// unit
// city
// state
// zip
// country
// address
/*
{
    prop_id
    headline
    type
    location
    bed
    bath
    startdate
    enddate
    currencytype
    rate
    minstay
    maxadults
    maxchild
    description
    unit
    city
    state
    zip
    country
    address
  }*/
