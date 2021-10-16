//updatePasswordUser()
function updatePasswordUser() {
    let newPassword = '123456'
    updatePassword(auth.currentUser, newPassword)
        .then(() => {
            console.log('Password atualizado com sucesso!')
        }).catch(erro => console.log(err));
}
//updateUser()
function updateUser() {
    updateProfile(auth.currentUser, {

    }).then(() => {
        console.log('Atualizado com sucesso');
    }).catch(err => console.log(err));
}
