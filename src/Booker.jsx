import React, { Component } from 'react';
import './booker.css';
import * as firebase from 'firebase';
import './firebase.config.js';
import moment from 'moment';
import 'moment/locale/fr';





class Booker extends Component {
    constructor(props) {
        super(props);
        this.bookingsRef = firebase.database().ref('bookings');
        this.newBooking = [];
        this.state = {
            name:'',
            tel:'',
            date:moment().format('YYYY-MM-DD'),
            time:'',
            persons:'',
            bookings: [],
            today_bookings:[],
            past_bookings:[],
            future_bookings:[]
        }
        this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
        this._handleInputChanges = this._handleInputChanges.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
    }
    
    componentWillMount() {
        this.getAllBookings()
    }
    

    getAllBookings(){
        this.bookingsRef.on('value', (snapshot) => {
            this.sortBookings(snapshot.val());
            this.setState({
                bookings: snapshot.val()
            });
        });
    }
    getTodayBookings(data) {
        let todayBookings = [];
        Object.values(data).forEach((booking) => {
            if(booking.date === moment().format("DD-MM-YYYY")){
                todayBookings.push(booking);
            } 
        }, this);
        return Object.values(todayBookings);
    }
    getPastBookings(data) {
        let pastBookings = [];
        Object.values(data).forEach((booking) => {
            if(booking.date < moment().format("DD-MM-YYYY")){
                pastBookings.push(booking);
            } 
        }, this);
        return Object.values(pastBookings);
    }
    getFutureBookings(data) {
        let futureBookings = [];
        Object.values(data).forEach((booking) => {
            if(booking.date > moment().format("DD-MM-YYYY")){
                futureBookings.push(booking);
            } 
        }, this);
        return Object.values(futureBookings);
    }
    sortBookings(data) {
        this.setState({
            today_bookings:this.getTodayBookings(data),
            past_bookings:this.getPastBookings(data),
            future_bookings:this.getFutureBookings(data)    
        });  
    }

    getBookingsByDate(date,option) {
        let theseBookings = [];
        Object.values(this.state.bookings).map((booking, index) => {
            //console.log(moment(date).format('DD-MM-YYYY'), booking.date)
            if(booking.date === this.reverseDate(date)) {
                console.log(booking.time)
                if((option === 'midi') && (booking.time === ('12:00'||moment('12:30','hh:mm')||'13:00'||'13:30'))) {
                    theseBookings = theseBookings.concat(booking);
                    return {theseBookings}
                }
                else if((option === 'soir') && (booking.time === ('19:00'||'19:30'||'21:30'||'22:00'))) {
                    theseBookings = theseBookings.concat(booking);
                    return {theseBookings}
                }
                else if (option === undefined) {
                    theseBookings = theseBookings.concat(booking);
                    return {theseBookings}
                } else {
                    console.log('Pas de service')
                }
            }
        })
        console.log(theseBookings);
    }

    reverseDate(dateObj) {
        return dateObj.split("-").reverse().join("-");
    }

    onDateChange(e) {
        e.persist();
        this.setState({
            date:moment(e.target.value,'YYYY-MM-DD')
        })
        //this.newBooking.date = this.reverseDate(e.target.value);
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
        this.newBooking.date = this.reverseDate(this.newBooking.date);
        this.newBooking.added = moment().format();
        console.log(this.newBooking)
        if(this.newBooking.name===''||this.newBooking.date===undefined||this.newBooking.time===undefined||this.newBooking.tel===''||this.newBooking.persons===''){
            alert('Remplir tous les champs du formulaire')
            return;
        }
        else if(this.newBooking.date < moment().format('DD-MM-YYYY')) {
            alert('Choisir une date ultérieure')
        }
        else if(this.newBooking.name.length > 30) {
            alert('wrong name')
            return;
        }
        else if((this.newBooking.tel.length>10) || (this.newBooking.tel.length < 10)) {
            alert('Le numéro de téléphone doit faire 10 chiffres (06xxxxxxxx)');
            return;
        }
        else if(this.newBooking.persons <= 0 || this.newBooking.persons > 15) {
            alert('Réservation pour moins d\'une personne ou plus de 15 interdites');
            return;
        }
        else {
            firebase.database().ref("bookings/"+this.state.bookings.length).set(this.newBooking)
            .then((response) => {
                
                this.setState({               
                    name:'',
                    tel:'',
                    date:moment().format('YYYY-MM-DD'),
                    time:'',
                    persons:'',
                    added:''
                });
                this.newBooking=[];

            })
            .catch((error) => {
                alert('Echec de la réservation');
                console.log(error);
            });
        }
        
    }
    

    renderBookings(bookings) {
        return Object.values(bookings).map((booking, index) => {
            return (
                <tr key={index}>
                    <td> { booking.name } </td>
                    <td> { booking.persons } </td>
                    <td> { booking.date } </td>
                    <td> { booking.time } </td>                  
                    <td> { booking.tel } </td>
                    <td> { booking.note } </td>
                </tr>
            )
        })
    }

   

    render() {
        let styles= {
            form:{
                display: 'flex',
                flexFlow: 'column',
                width: '50%',
                margin: '0 auto'
            }
        }
        return (
            <div>
                <div>
                    <form>
                        <input type="date" onChange={(e)=>this.getBookingsByDate(moment().format(e.target.value, 'DD-MM-YYYY'),'midi')} />
                    </form>
                </div>
                <div className='create'>
                    <h2>Créer une réservation</h2>
                    <form className='create-form' style={styles.form} onSubmit={(e) => this._handleBookingSubmit(e)} >
                        <label htmlFor="name">
                            Nom
                            <input required
                            value={this.state.name}
                            name='name'
                            onChange={(e) => this._handleInputChanges(e)} 
                            type="text"/>
                        </label>
                        <label htmlFor="tel">
                            Téléphone
                            <input required
                                value={this.state.tel}
                                name='tel' 
                                onChange={(e) =>this._handleInputChanges(e)} 
                                type="text"/>
                        </label>
                        <label htmlFor="persons">
                            Nombre
                            <input required
                                value={this.state.persons} 
                                name='persons'
                                onChange={(e) =>this._handleInputChanges(e)} 
                                type="number"/>
                        </label>
                        <label htmlFor="date">
                            Date
                            <input required
                                value={this.state.date} 
                                name='date' 
                                onChange={(e) =>this._handleInputChanges(e)} 
                                type="date"/>
                        </label>
                        <label htmlFor="time">
                            <select 
                                value={this.state.time} 
                                onChange={(e) => this._handleInputChanges(e)} 
                                name="time" id="time">
                                <option value="12:00">12:00</option>
                                <option value="12:30">12:30</option>
                                <option value="13:00">13:00</option>
                                <option value="13:30">13:30</option>
                                <option value="19:00">19:00</option>
                                <option value="19:30">19:30</option>
                                <option value="21:30">21:30</option>
                                <option value="22:00">22:00</option>
                            </select>
                        </label>
                        <label htmlFor="note">
                            Note
                            <input 
                                value={this.state.note} 
                                name='note' 
                                onChange={(e) =>this._handleInputChanges(e)}  
                                type="text"/>
                        </label>
                        <input value='submit' type="submit"/>
                    </form>
                
                
                </div>
                <div>
                    <h1>Toutes les réservations</h1>
                    <table className='all-bookings-container'>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Couverts</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Téléphone</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderBookings(this.state.bookings)}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h1>Aujourd'hui </h1> <span>(le {moment().format('DD-MM-YYYY')})</span>
                    <table className='all-bookings-container'>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Couverts</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Téléphone</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderBookings(this.state.today_bookings)}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h1>Toutes les réservations à partir de demain</h1>
                    <table className='all-bookings-container'>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Couverts</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Téléphone</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderBookings(this.state.future_bookings)}
                        </tbody>
                    </table>
                </div>
                
                
            </div>
        );
    }
}

export default Booker;


