import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import * as firebase from 'firebase';
import '../firebase.config.js';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

console.log(moment().unix())
console.log(moment(moment().unix()).isAfter(moment('2017-11-24').unix()))

class CreateBooking extends Component {
    constructor(props) {
        super(props);
        this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
        this._handleInputChanges = this._handleInputChanges.bind(this);
        this.newBooking=[];
        this.contacts=[];
        this.state = {
            name:'',
            tel:'',
            email:'',
            date:'',
            time:'',
            persons:'',
            note:''
        }

    }
    
    
    
    reverseDate(dateObj) {
        return dateObj.split("-").reverse().join("-");
    }

    _handleInputChanges(e) {
        e.persist();
        this.setState({
            [e.target.name]:e.target.value
        });
        this.newBooking[e.target.name] = e.target.value;
            
    }


    _handleBookingSubmit(event) {
        event.preventDefault();
        this.newBooking.bookStamp = moment(this.newBooking.date).unix();
        // console.log(moment(this.newBooking.date).unix()>moment().unix());
        this.newBooking.date = this.reverseDate(this.newBooking.date);
        this.newBooking.timestamp = moment().format();
        this.newBooking.service = (this.newBooking.time === ("12:00"||"12:30"||"13:00"||"13:30"))?'lunch':'dinner';
        console.log(this.newBooking)
        if(this.newBooking.name===''||this.newBooking.date===undefined||this.newBooking.time===undefined||this.newBooking.tel===''||this.newBooking.persons===''){
            alert('Remplir tous les champs du formulaire')
            return;
        }
        else if(moment().format('DD-MM-YYYY',this.newBooking.date) < moment().format('DD-MM-YYYY')) {
            alert('Choisir une date ultérieure')
            return;
        }
        else if(this.newBooking.name.length > 30) {
            alert('wrong name')
            return;
        }
        else if((this.newBooking.tel.length>14) || (this.newBooking.tel.length < 10)) {
            alert('Le numéro de téléphone doit faire 10 chiffres minimum (06xxxxxxxx ou +33 6xxxxxxxx)');
            return;
        }
        else if(this.newBooking.persons <= 0 || this.newBooking.persons > 15) {
            alert('Indiquez le nombre de personnes');
            return;
        }
        else {
            firebase.database().ref("bookings").push(this.newBooking)
            .then((response) => {                
                this.setState({               
                    name:'',
                    tel:'',
                    email:'',
                    date:'',
                    time:'',
                    persons:'',
                    added:'',
                    note:''
                });
                this.newBooking=[];
            })
            .catch((error) => {
                alert('Echec de la réservation');
                console.log(error);
            });
        }     
    }

    isRoomAvalaible(){
        
    }

    render () {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <div className="panel panel-primary">

                                <h2 className="panel-heading">Créer une réservation</h2>
                                <Form className="panel-body" onSubmit={(e) => this._handleBookingSubmit(e)} >                                   
                                <Row>
                                    <Col xs="12" sm="6">   
                                        <FormGroup>
                                            <Label for="name">Nom</Label>
                                            <Input  type="text" required
                                                    name="name"
                                                    id="name"
                                                    value={this.state.name}
                                                    onChange={(e) => this._handleInputChanges(e)}
                                                    placeholder="Prénom Nom" />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" sm="6">                        
                                        <FormGroup >
                                            <Label for="email">Email</Label>
                                            <Input  type="email" required
                                                    name="email"
                                                    id="email"
                                                    value={this.state.email}
                                                    onChange={(e) => this._handleInputChanges(e)}
                                                    placeholder="exemple@exemple.com" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <Label for="tel">Numéro de téléphone</Label>
                                            <Input  type="tel" required
                                                    name="tel"
                                                    id="tel"
                                                    value={this.state.tel}
                                                    onChange={(e) => this._handleInputChanges(e)}
                                                    placeholder="(exemple : 0611223344)" />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" sm="6">
                                    <FormGroup>
                                    <Label for="persons">Nombre de personnes attendues</Label>
                                    <Input  type="select" required
                                            name="persons"
                                            id="persons"
                                            value={this.state.persons}
                                            onChange={(e) => this._handleInputChanges(e)}
                                    >   
                                        <option value=""></option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                    </Input>
                                    <FormText>Plus nombreux ? Contactez nous au ...</FormText>
                                </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <Label for="date">Date de réservation</Label>
                                            <Input  type="date" required
                                                    name="date"
                                                    id="date"
                                                    value={this.state.date}
                                                    onChange={(e) => this._handleInputChanges(e)}
                                                    />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" sm="6">
                                        <FormGroup>
                                            <Label for="time">Heure d'arrivée</Label>
                                            <Input  type="select" required
                                                    name="time"
                                                    id="time"
                                                    value={this.state.time}
                                                    onChange={(e) => this._handleInputChanges(e)}
                                            >
                                            <optgroup label="Midi">
                                                <option value="12:00">12:00</option>
                                                <option value="12:30">12:30</option>
                                                <option value="13:00">13:00</option>
                                                <option value="13:30">13:30</option>
                                            </optgroup>
                                            <optgroup label="Soir">
                                                <option value="19:00">19:00</option>
                                                <option value="19:30">19:30</option>
                                                <option value="21:30">21:30</option>
                                                <option value="22:00">22:00</option>
                                            </optgroup>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm={{ size: 8, offset: 2 }}>
                                        <FormGroup>
                                            <Label for="note">Ajouter un commentaire (optionnel)</Label>
                                            <Input  type="text" 
                                                    name="note"
                                                    id="note"
                                                    value={this.state.note}
                                                    onChange={(e) => this._handleInputChanges(e)}
                                                    placeholder="Allergies, etc... " />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                    <Button color="primary">Créer la Réservation</Button>
                                </Form>                              
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


export default CreateBooking