var MedID = localStorage.getItem("MedID");

var currentMedication;
var title;
var intakefreq;
var meddetails;

function getMedData(MedID){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentMedication = db.collection("users").doc(user.uid).collection("medications")
            currentMedication.where("code", "==", MedID)
           .get()
           .then(queryMedications => {
               //see how many items are returned from the query with ".size"
               size = queryMedications.size;
               // get the documents returned from query with ".docs"
               meds = queryMedications.docs;   

               // Checking to see that there is one document per medications
               if (size = 1) {
                   var thisMed = meds[0].data();
                   title = thisMed.name;
                   document.getElementById("nameInput").innerHTML = title;
                   document.getElementById("nameInput").value = title;
                   intakefreq = thisMed.intake;
                   document.getElementById("intakeInput").innerHTML = intakefreq;
                   document.getElementById("intakeInput").value = intakefreq;
                   meddetails = thisMed.details;
                   document.getElementById("detailsInput").innerHTML = meddetails;
                   document.getElementById("detailsInput").value = meddetails;
                   
                   
               } else {
                   console.log("Query has more than one data")
               }
           })
           .catch((error) => {
               console.log("Error getting documents: ", error);
           });
           
        }
    })
}
    
getMedData(MedID);

function editMedInfo() {
    // Enable the form fields
    document.getElementById('medicationInfoFields').disabled = false;
}


function saveMedInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var newID;
            console.log("first");
            title = document.getElementById('nameInput').value;         //get the value of the field with id="nameInput"
            intakefreq = document.getElementById('intakeInput').value;     //get the value of the field with id="intakeInput"
            meddetails = document.getElementById('detailsInput').value;   //get the value of the field with id="detailsInput"
            console.log("second");
            currentMedication = db.collection("users").doc(user.uid).collection("medications").where("code","==",MedID)
            currentMedication.get().then(res=> {
                res.forEach((doc) => {
                    newID = doc.id;
                    db.collection("users").doc(user.uid).collection("medications").doc(newID).update({
                        name: title,
                        intake: intakefreq,
                        details: meddetails
                    })
                    .then(() => {
                        console.log("Document updated successfully!");
                    })
                });
            })

            document.getElementById('medicationInfoFields').disabled = true;
        }
    })
}