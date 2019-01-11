const graphql = require("graphql");
//const _ = require('lodash');
var Model = require("../DatabaseConnection");
var bcrypt = require("bcrypt-nodejs");
var signup = require("../routes/signup");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

const ProfileType = new GraphQLObjectType({
  name: "ProfileType",
  fields: () => ({
    Username: {
      type: GraphQLString
    },
    Password: {
      type: GraphQLString
    },
    FirstName: {
      type: GraphQLString
    },
    LastName: {
      type: GraphQLString
    },
    Email: {
      type: GraphQLString
    },
    Aboutme: {
      type: GraphQLString
    },
    Country: {
      type: GraphQLString
    },
    City: {
      type: GraphQLString
    },
    Gender: {
      type: GraphQLString
    },
    Hometown: {
      type: GraphQLString
    },
    School: {
      type: GraphQLString
    },
    Company: {
      type: GraphQLString
    },
    Language: {
      type: GraphQLString
    },
    PhoneNumber: {
      type: GraphQLString
    },
    Accounttype: {
      type: GraphQLString
    }
  })
});

const loginResult = new GraphQLObjectType({
  name: "loginResult",
  fields: () => ({
    result: { type: GraphQLBoolean },
    userData: { type: ProfileType }
  })
});

const signupResult = new GraphQLObjectType({
  name: "signupResult",
  fields: () => ({
    success: { type: GraphQLBoolean },
    duplicateUser: { type: GraphQLBoolean }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    login: {
      type: loginResult,
      args: {
        Username: {
          type: GraphQLString
        },
        Password: {
          type: GraphQLString
        }
      },
      async resolve(parent, args) {
        console.log("args: ", args);
        var isAuthenticated = false;
        var profileData = {};

        await Model.Userdetails.findOne(
          {
            Username: args.Username
          },
          (err, user) => {
            if (err) {
              isAuthenticated = false;
            } else {
              console.log("result", user.Username);
              if (!bcrypt.compareSync(args.Password, user.Password)) {
                console.log("Invalid Credentials!");
                //callback(null, null);
                isAuthenticated = false;
              } else {
                console.log("Corect creds!");
                isAuthenticated = true;

                profileData = user;
              }
            }
          }
        );

        console.log("isauth", isAuthenticated);
        console.log("Profile Data", profileData);
        if (isAuthenticated == true) {
          var result = {
            result: true,
            userData: profileData
          };
          console.log("UserData", result.userData);
        } else {
          var result = {
            result: false
          };
        }
        return result;
      }
    },
    profile: {
      type: ProfileType,
      args: {
        Email: {
          type: GraphQLString
        }
      },
      async resolve(parent, args) {
        console.log("args: ", args);
        var profileData = {};
        await Model.Userdetails.findOne(
          {
            Email: args.Email
          },
          (err, user) => {
            if (err) {
            } else {
              console.log("User details: ", user);
              profileData = user;
            }
          }
        );

        return profileData;
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    signup: {
      type: signupResult,
      args: {
        FirstName: {
          type: GraphQLString
        },
        LastName: {
          type: GraphQLString
        },
        Email: {
          type: GraphQLString
        },
        Password: {
          type: GraphQLString
        },
        Accounttype: {
          type: GraphQLInt
        }
      },

      resolve: (parent, args) => {
        return new Promise(async (resolve, reject) => {
          var successResult = false;
          var duplicateUserResult = false;
          await Model.Userdetails.findOne(
            {
              Email: args.Email
            },
            (err, user) => {
              if (err) {
              } else {
                if (user) {
                  console.log("User Exists!", user);
                  if (
                    args.Accounttype === user.Accounttype ||
                    user.Accounttype == 3
                  ) {
                    console.log("Duplicate user");
                    duplicateUserResult = true;

                    var resultData = {
                      success: successResult,
                      duplicateUser: duplicateUserResult
                    };
                    resolve(resultData);
                  } else {
                    user.Accounttype = 3;

                    user.save().then(async doc => {
                      console.log("User saved successfully.", doc);
                      //callback(null, doc);
                      successResult = true;

                      var resultData = {
                        success: successResult,
                        duplicateUser: duplicateUserResult
                      };
                      resolve(resultData);
                    });
                  }
                } else {
                  var user = new Model.Userdetails({
                    Username: args.Email,
                    Password: args.Password,
                    FirstName: args.FirstName,
                    LastName: args.LastName,
                    Email: args.Email,
                    Accounttype: args.Accounttype
                  });
                  console.log("Use saving..");
                  user.save().then(doc => {
                    console.log("User saved successfully.", doc);
                    successResult = true;
                    console.log("EOF");
                    var resultData = {
                      success: successResult,
                      duplicateUser: duplicateUserResult
                    };
                    resolve(resultData);
                  });
                }
              }
            }
          );
        });
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

return new Promise((resolve, reject) => {
  // resolve(result);
  res = {
    username: "aaa",
    country: "aaa",
    city: "aaa",
    address: "aaa",
    unit: "aaa",
    state: "aaa",
    zipcode: "aaa",
    headline: "aaa"
  };
  result.push(res);
  properties.find({ city: args.place }, function(err, profile) {
    if (err) reject(err);
    if (err) {
      console.log("Error while fething property list");
      result = "error";
      resolve(result);
    } else {
      console.log("Fetched the property list: ", profile);
    }
    resolve(profile);
  });
});
