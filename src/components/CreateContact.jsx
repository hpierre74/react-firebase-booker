

function createContact(email, name, tel) {
    const contact = {
        "name": name,
        "email": email,
        "tel": tel
    }
    return FirebaseFirestore.database().ref('contacts').push(contact)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(error)
    });
}

