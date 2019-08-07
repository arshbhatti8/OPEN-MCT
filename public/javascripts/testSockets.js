//establish webSocket connection and get data
let exampleSocket;
async function setupSockets(socketName){
    try {
        exampleSocket = await new WebSocket("ws://localhost:8080/realtime");
    } catch(err){
        console.log("Error in creating socket ",err);
    }
    exampleSocket.onopen = () => exampleSocket.send(`subscribe ${socketName}`);
    exampleSocket.onmessage = async (event) => {
        try{
            let data = await JSON.parse(event.data);
            addDataToTable(data);
        }catch(err){
            console.log("Error:",err);
        }
    }
}

function killSocket(){
    //check if pwr.v is the radio button that is selected
    //if it is then unsubscribe that or then unsubscribe pwr.c
    pwrVchecked ? exampleSocket.send("unsubscribe pwr.v") : exampleSocket.send("unsubscribe pwr.c");
}

function addDataToTable(data){
    let listOrderAscending = document.querySelector("#ascendingRadio");
    //by default insert into last row because ascending order is default
    let insertOnIndex = -1;
    if (!listOrderAscending.checked){
        insertOnIndex = 0;
    }
    let tbody = document.querySelector("#powerSystemsTable").getElementsByTagName('tbody')[0];
    let row = tbody.insertRow(insertOnIndex);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let date = new Date(data.timestamp);
    cell1.innerHTML = data.id;
    cell2.innerHTML = date;
    cell3.innerHTML = data.value;
}

//byDefault pwr.v is the subscribed socket
setupSockets("pwr.v");