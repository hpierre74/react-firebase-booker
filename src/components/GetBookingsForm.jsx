import React, { Component } from 'react';
import BookingsTable from './BookingsTable.jsx';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/fr';

class GetBookingsForm extends Component {
    constructor(props) {
        super(props)
        this.state= {
            requested_bookings:[],
            date:moment().format('DD-MM-YYYY'),
            service:'',
            month:''
        }
    }
    
    _handleSubmit(e) {
        e.preventDefault();
        this.getBookingsByDate(this.state.date, this.state.service);
    }
    

    _handleInputChanges(e) {
        e.persist();
        this.setState({
            [e.target.name]:(e.target.name==='date')?this.props.reverseDate(e.target.value):e.target.value
        })
    }
    

    getBookingsByDate(date, service) {
        let theseBookings = [];
        let roomsLeft = [];
        let roomLeft= 30;
        Object.values(this.props.bookings).map((booking, index) => {
            if(booking.date === date && (booking.service === service || service==='') ) {
                    roomsLeft = roomsLeft.concat({[date] :booking.persons})
                    roomLeft= roomLeft-booking.persons;
                    console.log(roomLeft)           
                    theseBookings = theseBookings.concat(booking);
                return {theseBookings, roomsLeft}
            }
        })
        this.setState({
            requested_bookings: theseBookings
        })
        console.log(roomsLeft)
        return {theseBookings, roomsLeft}
    }
    
    render () {
        return (
            <Container>
                <Row>
                    <Col>
                    <div className="panel panel-primary">
                        <h4 className='panel-heading'>Réservations du { this.state.date }</h4>
                        
                        <Form className='panel-body' onSubmit={(e)=>this._handleSubmit(e)}>
                            <Row>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label>Date</Label>
                                        <Input
                                            value={this.props.reverseDate(this.state.date)}
                                            type="date"
                                            name="date"
                                            onChange={(e)=>this._handleInputChanges(e)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6">
                                    <FormGroup>
                                        <Label>Service</Label>
                                        <Input
                                            value={this.state.service}
                                            type="select"
                                            name="service"
                                            onChange={(e)=>this._handleInputChanges(e)}
                                        >
                                            <option value=''></option>
                                            <option value="lunch">Midi</option>
                                            <option value="dinner">Soir</option>
                                        </Input>
                                    </FormGroup>
                                </Col>    
                            </Row>
                            <Button color="primary">Rechercher</Button>
                        </Form>
                        <div>
                            <h4>Midi:  / Soir:</h4>
                        </div>
                        <div>
                            <BookingsTable bookings={this.state.requested_bookings}/>
                        </div>
                    </div>
                </Col>
            </Row>
            </Container>
        )
    }
}

export default GetBookingsForm