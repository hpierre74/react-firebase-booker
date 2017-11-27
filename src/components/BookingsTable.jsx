import React from 'react';
import Booking from './Booking.jsx';
import { Container, Table, Button} from 'reactstrap';

const BookingsTable = (props) => {
    const { title, bookings } = props;
    const renderBookings = (bookings) => {
        return Object.values(bookings).map((booking, index) => {
            return (
                <Booking  key={index} index={index} booking={booking} />
            )
        })
    }
       return (
        <div>
        <Container>
            <div className={(title)?"panel panel-primary":""}>
                <h1 className={(title)?'panel-heading':""}>{title}</h1>
                <Table responsive striped className='all-bookings-container'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>Couverts</th>
                            <th>Date</th>
                            <th>Heure</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                    {renderBookings(bookings)}
                    </tbody>
                </Table>
            </div>
        </Container>
        </div>
    )
}

export default BookingsTable