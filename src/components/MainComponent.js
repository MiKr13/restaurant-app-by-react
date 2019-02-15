import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import Home from './HomeComponent';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Contact from './ContactComponent';
import DishDetail from './DishdetailComponent';
import About from './AboutComponent';

import { addComment, fetchDishes, fetchComments, fetchPromos } from '../redux/actionCreators';

const mapDispatchToProps = dispatch => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => { dispatch(fetchDishes())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos())
});

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
};

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
        title: "Ristorante Con Fusion",
    };
  }

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }

  render() {

    const HomePage = () => {
      return (
        <Home 
          dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishErrMess={this.props.dishes.err}
          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
          promoLoading={this.props.promotions.isLoading}
          promoErrMess={this.props.promotions.err}
          leader={this.props.leaders.filter((leader) => leader.featured)[3]}
        />
      );
    }

    const DishWithId = ({match}) => {
      return(
        <DishDetail 
          dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.err}
          comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
          commentsErrMess={this.props.comments.err}
          addComment={this.props.addComment}
        />
      );
    };

    return (
      <div style={{margin: 0 + 'em', padding: 0 + 'em'}}>
        <Header title={this.state.title}/>
          <Switch>
            <Route path="/home" component={HomePage} />
            <Route exact path="/menu" component={() => <Menu dishes ={this.props.dishes} />} />
            <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
            <Route path='/menu/:dishId' component={DishWithId} />
            <Route exact path='/aboutus' component={ () => <About leaders={this.props.leaders} />} />
            <Redirect to="/home" />
          </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));