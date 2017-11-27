import React, { Component } from 'react';
import './booker.css';
import * as firebase from 'firebase';
import './firebase.config.js';
import moment from 'moment';
import 'moment/locale/fr';
import CreateBooking from './components/CreateBooking.jsx';
import BookingsTable from './components/BookingsTable.jsx';
import GetBookingsForm from './components/GetBookingsForm.jsx';




class Booker extends Component {
    constructor(props) {
        super(props);
        this.bookingsRef = firebase.database().ref('bookings').orderByChild('date');
        this.state = {
            roomAvalaible: [],
            bookings: [],
            requested_bookings:[]
        }
    }
    
    componentWillMount() {
        this.getAllBookings();
        
    }
    componentDidUpdate (prevProps, prevState) {
        this.getAvalaibleRoom();
        this.isRoomAvalaible(moment('DD_MM-YYYY','30-11-2017'))
    }
    
    getAllBookings(){
        this.bookingsRef.on('value', (snapshot) => {
            this.setState({
                bookings: snapshot.val()
            });
        })  
    }
    isRoomAvalaible(date) {
        let weekBookings = []
        Object.values(this.state.bookings).map((booking, index) => {
            if(moment().format('DD-MM-YYYY',date) === moment().format('DD-MM-YYYY',booking.date)) {
                weekBookings = weekBookings.concat(booking);
                return {weekBookings}
            }
            return {weekBookings}
        });
        console.log(weekBookings);
    }
    getAvalaibleRoom(date) {
        let roomLeftByService = {
            lunch:30,
            dinner:{
                first:30,
                second:30
            }
        }
        let roomCalendar = {lunch:[],dinner:[]}

        Object.values(this.state.bookings).forEach((booking, index) => {
            if(date === booking.date) {
                if (booking.service === 'lunch') {
                    return roomLeftByService.lunch - booking.persons
                } else { 
                    return roomLeftByService.dinner.first-booking.persons;
                }
            }
            (booking.service === 'lunch')?
                roomCalendar.lunch = roomCalendar.lunch.concat({[booking.date]:roomLeftByService.lunch - booking.persons}) :
                roomCalendar.dinner = roomCalendar.dinner.concat({[booking.date]:roomLeftByService.dinner.first-booking.persons});

           
            return {roomLeftByService}
        })
        console.log(roomLeftByService)
        
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
    
    
    render() {
        return (
            <div>
                <GetBookingsForm 
                    bookings={this.state.bookings} 
                    reverseDate={this.reverseDate} 
                    _handleInputChanges={this._handleInputChanges}/>
                <CreateBooking />
                <BookingsTable bookings={this.state.bookings} title="all bookings"/>


            </div>
        );
    }
}

export default Booker;


