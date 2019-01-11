import React, { Component } from "react";
import axios from "axios";
import Property from "../components/Property";
import SelectedPropertyDetail from "../components/SelectedPropertyDetail";
import Navbar from "../Navbar";
import { connect } from "react-redux";
import { userActions } from "../Actions/UserActions";
import { graphql, withApollo } from "react-apollo";
import { searchQuery } from "../queries/queries";
class PropertyList extends React.Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      // fromDate: this.props.fromDate,
      // toDate: this.props.toDate,
      // location: this.props.location,
      // adults: this.props.adults,
      // kids: this.props.kids,
      headline: "",
      Properties: [],
      currentPropID: "",
      displaylist: true,
      PropertyPhotos: [],
      currentPage: 1,
      todosPerPage: 2
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickPage = this.handleClickPage.bind(this);
  }
  handleClickPage(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
  async componentDidMount() {
    console.log("component did mount ", this.state);
    var photos = [];
    //  fromDate
    const data = {
      fromDate: localStorage.getItem("fromDate"),
      toDate: localStorage.getItem("toDate"),
      location: localStorage.getItem("location"),
      adults: 4,
      kids: 2
    };
    //   const userName = { username: localStorage.getItem("userId") };
    console.log("DATA", data);
    this.props.client
      .query({
        query: searchQuery,
        variables: {
          fromDate: data.fromDate,
          toDate: data.toDate,
          location: data.location
        }
        //refetchQueries: [{ query: loginQuery }]
      })
      .then(response => {
        console.log("property search", response.data.search);
        this.setState({
          Properties: response.data.search
        });
      });

    // axios.post("http://localhost:3001/places", data).then(async response => {
    //   console.log(JSON.stringify(response.data));

    //   this.setState({
    //     Properties: response.data.value
    //   });

    //   console.log("this.state.Properties.length", this.state.Properties.length);
    //   // for (let i = 0; i < this.state.Properties.length; i++) {
    //   //   const data = { id: this.state.Properties[i].properties.prop_id };
    //   //   console.log("inside", this.state.Properties[i].properties.prop_id);

    //   //   await axios
    //   //     .post("http://localhost:3001/getPropertyImg", data)
    //   //     .then(async response => {
    //   //       console.log(JSON.stringify(response.data));
    //   //       photos.push(response.data);
    //   //       this.setState({
    //   //         PropertyPhotos: photos
    //   //       });
    //   //       console.log("response imagee", JSON.stringify(photos));
    //   //       console.log("photos.length", JSON.stringify(photos.length));
    //   //       console.log(
    //   //         "PropertyPhotos",
    //   //         JSON.stringify(this.state.PropertyPhotos)
    //   //       );
    //   //     });
    //   // }
    //   // var finalProperties = [];
    //   // this.state.Properties.forEach(property => {
    //   //   this.state.PropertyPhotos.forEach(photo => {
    //   //     //  console.log("this.state.Propertyyy", property);
    //   //     //console.log("this.state.photoo", photo);
    //   //     if (photo.propid === property.properties.prop_id) {
    //   //       property.photo = photo.img;

    //   //       console.log("this.state.Propertyyy", JSON.stringify(property));
    //   //       finalProperties.push(property);
    //   //     }
    //   //   });
    //   // });
    //   // this.setState({
    //   //   Properties: finalProperties
    //   // });
    // });

    //  console.log("this.state.Properties.length", PropertyList);
  }
  handleClick(id) {
    console.log(id);
    localStorage.setItem("currentPropID", id);
    this.setState({
      //currentPropID: id,
      displaylist: false
    });
    const propdata = {
      currentPropID: id
    };

    // this.props.setPropertyid(propdata);
    // console.log(this.state);
  }
  render() {
    let NoPlaces = null;
    let redirecty_value = null;
    const { currentPage, todosPerPage } = this.state;

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    let currentTodos = null;
    let renderPageNumbers = null;

    console.log("properties", this.state.PropertyPhotos);
    if (this.state.PropertyPhotos.length > 0) {
      console.log(
        "this.state.PropertyPhotos.length",
        this.state.PropertyPhotos.length
      );
      var imgsrc = "data:image/png;base64," + this.state.PropertyPhotos[0].img;
    } else {
      var imgsrc = "";
    }
    if (this.state.displaylist) {
      currentTodos = this.state.Properties.slice(
        indexOfFirstTodo,
        indexOfLastTodo
      );
      console.log("current todod", currentTodos);
      // Logic for displaying page numbers
      const pageNumbers = [];
      for (
        let i = 1;
        i <= Math.ceil(this.state.Properties.length / todosPerPage);
        i++
      ) {
        pageNumbers.push(i);
      }

      renderPageNumbers = pageNumbers.map(number => {
        return (
          <button
            className="backgroundbutt btn"
            key={number}
            id={number}
            onClick={this.handleClickPage}
            class="colorful"
          >
            {number}
          </button>
        );
      });

      redirecty_value = currentTodos.map((property, index) => {
        return (
          <Property
            headline={property.headline}
            key={property.prop_id}
            value={property.prop_id}
            bath={property.bath}
            bed={property.bed}
            unit={property.unit}
            clicked={this.handleClick}
            houseType={property.type}
            capacity={property.maxadults}
            rate={property.rate}
            //  imgsrc={"data:image/png;base64," + property.photo}
          />
        );
      });

      return (
        <div>
          <Navbar />
          <ul>{redirecty_value}</ul>
          <ul>{renderPageNumbers}</ul>
        </div>
      );
    } else
      return (
        <div>
          <SelectedPropertyDetail
          // propid={this.state.currentPropID}
          // fromDate={this.state.fromDate}
          // toDate={this.state.toDate}
          />
        </div>
      );
  }
}

// const mapStateToProps = state => {
//   return {
//     fromDate: state.bookproperty.searchdata.fromDate,
//     toDate: state.bookproperty.searchdata.toDate,
//     location: state.bookproperty.searchdata.location,
//     adults: state.bookproperty.searchdata.adults,
//     kids: state.bookproperty.searchdata.kids,
//     displaylist: state.bookproperty.displaylist
//   };
// };
// const mapDispatchtoProps = dispatch => {
//   return {
//     setPropertyid: propdata => dispatch(userActions.setPropertyid(propdata))
//   };
// };
export default withApollo(PropertyList);
//export Home Component
// export default connect(
//   mapStateToProps,
//   mapDispatchtoProps
// )(PropertyList);
//export default PropertyList;

/*
class TripsBoard extends React.Component {
 constructor(props) {
    super(props);
   this.state = {
     latesttrips: [],
      NoPlacestoShow : true,
    currentPage: 1,
    todosPerPage: 2
  }
  this.handleClickPage = this.handleClickPage.bind(this);
  }

  handleClickPage(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }
 
  render() {
    let NoPlaces = null;
    let Redirect_to_Home = null;
    let redirecty_value = null;

   
    const { currentPage, todosPerPage } = this.state;

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    let currentTodos = null;
    let renderPageNumbers =  null;


      }
      else
      {
        currentTodos  = this.state.latesttrips.slice(indexOfFirstTodo, indexOfLastTodo);
            // Logic for displaying page numbers
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(this.props.updateTrips.length / todosPerPage); i++) {
              pageNumbers.push(i);
            }
  
            renderPageNumbers = pageNumbers.map(number => {
              return (
                <button class="backgroundbutt btn"
                  key={number}
                  id={number}
                  onClick={this.handleClickPage}
                class="colorful">{number}</button>
              );
            });
        redirecty_value  = currentTodos.map((trip, index) => {
          return (
            <TripsBoardPlaces
              key={index}
              id={trip.id}
          name={trip.name}
              type={trip.type}
              location={trip.location}
              bed={trip.bed}
              bath={trip.bath}
              description={trip.description}
              startdate={trip.startdate}
              enddate={trip.enddate}
              clicked={this.handleClick}
             value={trip.id}
             rate={trip.rate}
             unit={trip.unit}
              />
          ); //return
        }) //map
      }
    }
    else
    {
        Redirect_to_Home = (<Redirect to="/login" />)
    }
    return (
        <div>
        {Redirect_to_Home}
        <br />
         <hr />
         <div class="headingtrips">
            <h1> Trip Boards </h1>
            <h4> Trip Boards help you keep track of the places you love.</h4> 
        </div>
        {NoPlaces}
        <div >
            <ul>
            {redirecty_value}
            </ul>
       </div>*/
