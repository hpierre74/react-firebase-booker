import React from 'react'

const Booking = (props) => {
    const { booking, index } = props;
        return (
            <tr key={index}>
                <th scope="row">{index+1}</th>
                <td> { booking.name } </td>
                <td> { booking.persons } </td>
                <td> { booking.date } </td>
                <td> { booking.time } </td>                  
                <td> { booking.tel } </td>
                <td> { booking.email } </td>
                <td> { booking.note } </td>
            </tr>
        )
    }

export default Booking