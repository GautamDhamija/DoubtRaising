var globalUserData={}


//getting logged in user data
auth.onAuthStateChanged((user)=>{
    if(user){
        globalUserData=user
        // console.log(user)
        $(".printEmail").text(user.email)
    }else{
        //login file setup
        window.location.href = './login.html'
    }
})

//logging out user
$("#logoutButton").on("click",(event)=>{
    event.preventDefault()
    auth.signOut().then(()=>{
        // console.log('user out')
        window.location.href = './login.html'
    })

})


//Realtime fetching database

var dbFetch=(subject)=>{
    db.collection('posts').orderBy("timestamp").onSnapshot((snapshot) => {

        let changes = snapshot.docChanges()
    
        changes.forEach(change => {
            // console.log(doc)
    
            if (change.type == "added") {
                if(subject=="ViewAll")
                printPost(change.doc.id, change.doc.data())

                else{

                    if(change.doc.data().subject==subject)
                    // console.log(change.doc.data())
                    printPost(change.doc.id, change.doc.data())
                }
            }
            else if (change.type == "removed") {
                // console.log(change.doc)
            }
    
        });
    })
}

dbFetch("ViewAll")



//function to print new doubt
const printPost = (id, post) => {
    let mahID = id
    $("#allPosts").prepend(`
    <div id="${id}">
    <div class="card shadow mb-4 mt-4">
    <div class="card-header py-3 bg-primary">
    
        <h6 class="m-0 font-weight-bold text-light"><b>${post.creator}:&nbsp    </b>${post.ques}</h6>
    </div>
    <div class="card-body">
        <p>${post.quesDescription}</p>
    </div>
    <div class="card-header py-3">
    
        <h6 class="m-0 font-weight-bold text-light badge badge-warning">${post.subject}</h6>
        <h6 class="m-0 font-weight-bold text-light badge badge-danger">${post.tags}</h6>
        <div class="input-group mb-3 mt-2">
            <input type="text"  class="form-control" placeholder="Write your solution here"
                aria-label="Recipient's username" aria-describedby="basic-addon2">
            <div class="input-group-append"></div>
            <button class="input-group-text "  onclick="postAnswer(event,${mahID})">Comment</button> 
            </div>
        
            <div id="commentContainer">
        ${printComment(post.comments)}
        </div>
    </div>
</div>
</div>
`
    )
}


//printing old Comments
const printComment = (comments) => {
    if (comments.length == 0) {
        return ""
    } else {
        // console.log(comments.length)

        let toAppend = ""

        comments.forEach((comment) => {
            toAppend = toAppend + `<div class="card m-2">
                                <div class="card-header">
                                    ${comment.username}
                                </div>
                                <div class="card-body">
                                   ${comment.commentBody}
                                </div>
                            </div>`
        })
        return toAppend
    }
}


//posting a Answer
const postAnswer = (e, id) => {
    // console.log(id.childNodes[1].childNodes[5].childNodes[5].childNodes[0])
    let newComment = e.target.parentElement.childNodes[1].value
    let mgid = id.id
    var docRef = db.collection('posts').doc(mgid)

    docRef.get().then(function (doc) {
        if (doc.exists) {

            // console.log("Document data:", doc.data().comments);
            let oldComments = doc.data().comments

            //pushing new comment into array
            oldComments.push({
                username: globalUserData.email,
                commentBody: newComment
            })

            console.log(oldComments)
            //updating new comment in database
            db.collection("posts").doc(mgid).update({
                comments: oldComments
            }).then(() => {
                e.target.parentElement.childNodes[1].value=""
                // alert("Comment Posted")
            })


            // printing Comments
            let toAppend = e.target.parentElement.parentElement.childNodes[7]
            // console.log(toAppend)   
            toAppend.innerHTML = printComment(oldComments)

        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });



}


//Creating New Doubt
$("#postDoubt").on("click", () => {
    let ques = $("#doubtQues").val()
    let quesDescription = $("#description").val()
    let subject = $("#subject").val()
    let tags = $("#tags").val().split(" ")
    let comments = new Array()
    let creator = globalUserData.email
    let votes = 0
    let date = new Date
    let timestamp = date.getTime()
    console.log({ ques, quesDescription, subject, tags })
    db.collection('posts').add({
        ques,
        quesDescription,
        subject,
        tags,
        comments,
        creator,
        votes,
        timestamp
    }).then(() => {
        $("#doubtQues").val("")
        $("#description").val("")
        $("#subject").val("")
        $("#tags").val("")
        alert("Doubt Posted")
    }).catch((error) => {
        console.log(error)
    })
})

//subjectwise loading
$(".subjectWise").on("click",(event)=>{
    event.preventDefault()
    //deleting all posts
    $("#allPosts").html("")

   subject=event.target.parentElement.childNodes[3].innerText+""
    console.log(subject)
    dbFetch(subject)
})

// loading user wise posts

db.collection('posts').orderBy("timestamp").onSnapshot((snapshot) => {

    let changes = snapshot.docChanges()

    changes.forEach(change => {
        // console.log(doc)

        if (change.type == "added") {
            if(change.doc.data().creator==globalUserData.email){

                // console.log(change.doc.data())
                printUserPost(change.doc.id, change.doc.data())
            }

        }
        else if (change.type == "removed") {
            // console.log(change.doc)
            let id=change.doc.id
            id="#"+id
            // console.log(id)
             $(id).remove()
        }

    });
})

var printUserPost=(id,post)=>{
    let itsID=id
    $("#userPosts").prepend(`
    <div id="${id}">
    <div class="card shadow mb-4 mt-4">
    <div class="card-header py-3 bg-primary">
    
        <h6 class="m-0 font-weight-bold text-light">
        ${post.ques}
        <div class="btn btn-danger deleteButton" onclick="deletePost(${itsID})" style="float: right;">DELETE</div>

        </h6>
    </div>
    <div class="card-body">
        <p>${post.quesDescription}</p>
    </div>
    <div class="card-header py-3">
    
        <h6 class="m-0 font-weight-bold text-light badge badge-warning">${post.subject}</h6>
        <h6 class="m-0 font-weight-bold text-light badge badge-danger">${post.tags}</h6>
        <div class="input-group mb-3 mt-2">
            <input type="text"  class="form-control" placeholder="Write your solution here"
                aria-label="Recipient's username" aria-describedby="basic-addon2">
            <div class="input-group-append"></div>
            <button class="input-group-text "  onclick="postAnswer(event,${itsID})">Comment</button> 
            </div>
        
            <div id="commentContainer">
        ${printComment(post.comments)}
        </div>
    </div>
</div>
</div>
    `)

}

// delete working from userProfile
var deletePost=(id)=>{
    console.log(id.id)
    db.collection('posts').doc(id.id).delete()
}