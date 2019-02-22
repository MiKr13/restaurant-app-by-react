import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label, Col, Row, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { LocalForm, Errors, Control } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

import { Loading } from './LoadingComponent';

import { baseUrl } from '../shared/baseUrl';

const FormatDate = ({cdate}) => {
  var options = { month: 'short', day: '2-digit', year: 'numeric' };
  return new Date(cdate).toLocaleDateString([],options);
}

const RenderDish = ({dish}) => {
  if (dish != null)
    return (
        <FadeTransform in transformProps={{
            exitTransform: 'scale(0.5) translateY(-25%)'
        }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
      </FadeTransform>
    );
  else
    return (
      <div></div>
    );
}

const RenderComments = ({comments, postComment, dishId}) => {
  if ( comments !=null )
    return(
        <div>
            <ul className="list-unstyled">
            <Stagger in>
                { comments.map((comment) => ( // direct return es6
                    <Fade in>
                        <li key={comment.id}>
                            <p>{comment.comment}</p>
                            <p>-- {comment.author}, <FormatDate cdate = {comment.date} /></p>
                        </li>
                    </Fade>
                ))
                }
            </Stagger>
            </ul>
            <CommentForm dishId={dishId} postComment = {postComment} />
        </div>
    );
  else
    return (
    <div></div>
    );
}

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            isModalOpen: false
        };
    }

    
    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        // this.toggleModal();
    }

    render() {

        return(
            <div className="container">
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil-square-o fa-lg"></span> Submit Comment</Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        
                            <Row className="form-group">
                                <Label htmlFor="rating" md={2}>Your Rating</Label>
                                <Col md={10}>
                                    <Control.select model=".rating" name="rating"
                                            className="form-control" defaultValue="" validators={{required}}>
                                        <option value="" disabled hidden>Choose here...</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Control.select>
                                    <Errors
                                        className="text-danger"
                                        model=".rating"
                                        show="touched"
                                        messages={{
                                            required: 'Required '
                                        }}/>
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="author" md={2}>Author</Label>
                                <Col md={10}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Full Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(20)
                                        }}/>
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 2 characters ',
                                            maxLength: 'Must be 15 characters or less '
                                        }}/>
                                </Col>                        
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="comment" md={2}>Any other suggestions</Label>
                                <Col md={10}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        className="form-control"
                                        rows="6" placeholder="Any other suggestions"
                                        ></Control.textarea>
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Col md={{size: 10, offset: 2}}>
                                    <Button type="submit">
                                        Submit Comment
                                    </Button>
                                </Col>
                            </Row>

                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const DishDetail = (props) => {

    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    } else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    } else if(props.dish != null)
        return (
        <div className="container">
            <div className="row" style={{margin: 0 + 'em', padding: 0 + 'em'}}>
            <Breadcrumb>
                <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
                <h3>{props.dish.name}</h3>
                <hr />
            </div>                
            </div>
            <div className="row" style={{margin: 0 + 'em', padding: 0 + 'em'}}>
            <div className="col-xs-12 col-sm-12 col-md-6 ml-4 mr-2 my-3">
                <RenderDish dish= {props.dish} />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-5 my-3">
                <Card>
                <CardBody>
                    <CardTitle>Comments</CardTitle>
                    <RenderComments comments= {props.comments}
                        postComment={props.postComment}
                        dishId={props.dish.id}
                    />
                </CardBody>
                </Card>
            </div>
            </div>
        </div>
        );
  else
    return (
      <div></div>
    );
}

export default DishDetail;