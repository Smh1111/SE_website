const tableElement = document.getElementById("table");


function populateData() {

      var table = document.getElementById("table");
            var rowCount = table.rows.length;

            var row = table.insertRow(rowCount);

            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            var cell4 = document.createElement("td");

            cell1.innerHTML = rowCount + ".";
            cell2.innerHTML = "New Row Title";
            cell3.innerHTML = "2023 Nov 12.";
            cell4.innerHTML = '<button>Edit</button> <button>Delete</button>';

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
}


populateData()
populateData()
populateData()
populateData()