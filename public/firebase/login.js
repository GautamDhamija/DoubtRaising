


    $("#loginButton").on("click",(event)=>{
        event.preventDefault()
        let email=$("#emailID").val()
        let password=$("#passW").val()
        auth.signInWithEmailAndPassword(email,password).then((cred)=>{
            // alert("user logged in as"+cred.user)
            window.location.href = './index.html'
        }).catch((error)=>{
         console.log(error)   
        })
    })