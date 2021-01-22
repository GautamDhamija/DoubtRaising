

$("#createUser").on("click",()=>{
    let username=$("#fname").val()+" "+$("#lname").val()
    let email=$("#email").val()
    let password=$("#passW").val()
    let passwordRepeat=$("#rPassW").val()

    console.log({username,email,password})

    if(password==passwordRepeat){

        //Creating User
        auth.createUserWithEmailAndPassword(email,password).then((user)=>{
            var currentUser= firebase.auth().currentUser
            currentUser.updateProfile({
                displayName:username
            }).then(()=>{
                window.location.href = './../login.html'
            })
        })

    }

})