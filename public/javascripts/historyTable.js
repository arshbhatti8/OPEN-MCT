//Todo Standardize data types by exporting them from somewhere or making them objects

let data =null;
//***Number of Minutes you want to get historical data for, defaults to one***
let minutes = 1;

//function to fetch data
async function getData(dataType){
//Get start/end times for query params
    let endTime = Date.now();
    let startTime = endTime - minutes * 60000;
    let timeRangeElement = document.querySelector("#timeRange");
    timeRangeElement.innerText = `Data from: ${new Date(startTime)} to ${new Date(endTime)}`;
    try {
        const response = await
        fetch(`http://localhost:8080/history/${dataType}?start=${startTime}&end=${endTime}`);
        data = await response.json();
    } catch(err){
        console.log("Error in fetching data/converting data to json: ",err);
    }
    return data;
}

function updateMinutes(event) {
    minutes = document.querySelector("#minutes").value;
    let dataType;
    !pwrVchecked ? dataType="pwr.c" : dataType="pwr.v";
    getData(dataType).then(responseData=> {
        data = responseData;
        paintTableData(data,ascendingChecked)
});
}


//For inserting data into the table according to whatever dataType is selected
function paintTableData(data,ascendingChecked){
    if(ascendingChecked){
        data.sort(sortAscending);
    }
    else if (!ascendingChecked){
        data.sort(sortDescending);
    }
    //insert Data into Table body
    let old_tbody = document.querySelector("#powerSystemsTable").getElementsByTagName('tbody')[0];
    let new_tbody = document.createElement('tbody');
    data.forEach((element,index)=>{
    let row = new_tbody.insertRow(index);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    let date = new Date(element.timestamp);
    cell1.innerHTML = element.id;
    cell2.innerHTML = date;
    cell3.innerHTML = element.value;
    });
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
}

//changing radio button enabling
let pwrVchecked = true;
function handleRadioClick(event){
    //check which radio button is clicked and mangae subscription and get historical data
    //according to the selected radio button
    if(event.srcElement.value==="pwr.v"){
        pwrVchecked = true;
        exampleSocket.send("unsubscribe pwr.c");
        getData("pwr.v").then(data=>paintTableData(data,ascendingChecked));
        setupSockets("pwr.v");
    }
    if(event.srcElement.value==="pwr.c"){
        pwrVchecked = false;
        exampleSocket.send("unsubscribe pwr.v");
        getData("pwr.c").then(data=>paintTableData(data,ascendingChecked));
        setupSockets("pwr.c");
    }
}

//handling ascending/descending order
//sorting funcitons
function sortAscending(a, b) {
    let timestamp1 = a.timestamp;
    let timestamp2 = b.timestamp;
    let comparison = 0;
    if (timestamp1 > timestamp2) {
        comparison = 1;
    } else if (timestamp1 < timestamp2) {
        comparison = -1;
    }
    return comparison;
}
function sortDescending(a,b) {
    let timestamp1 = a.timestamp;
    let timestamp2 = b.timestamp;
    let comparison = 0;
    if (timestamp1 > timestamp2) {
        comparison = 1;
    } else if (timestamp1 < timestamp2) {
        comparison = -1;
    }
    return comparison * -1;
}

let ascendingChecked = true;
function handleSortingOrder(event){
    if(event.srcElement.value==="Ascending"){
        ascendingChecked = true;
        paintTableData(data,ascendingChecked)
    }
    if(event.srcElement.value==="Descending"){
        ascendingChecked = false;
        paintTableData(data,ascendingChecked)
    }
}

//calling funciton getData and then painting the results in a table
getData("pwr.v").then(responseData=> {
    data = responseData;
    paintTableData(data,ascendingChecked)
});
