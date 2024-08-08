import "./App.css";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "Customer",
    selector: (row) => row.customer,
  },
  {
    name: "Month",
    selector: (row) => row.month,
  },
  {
    name: "Amount($)",
    selector: (row) => row.amount,
  },
  {
    name: "Reward Point/Transaction",
    selector: (row) => row.reward,
  },
];

const newColumns = [
  {
    name: "Month",
    selector: (row) => row.month,
  },
  {
    name: "Reward Points/Month",
    selector: (row) => row.totReward,
  },
];

function App() {
  const [userData, setUserData] = useState([]);
  const [displayReward, setDisplayReward] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [rewardData, setRewardData] = useState([]);
  const [totalReward, setTotalReward] = useState(0);

  useEffect(() => {
    fetch("https://dummyjson.com/c/a874-b912-4617-a7a6")
      .then((res) => res.json())
      .then((resp) => {
        //I have added a fake api with the desired json response.Please refer to SampleResponse.json file to view the response.
        let rewardArr = [...resp];
        rewardArr.forEach((item, i) => {
          if (item.amount >= 100) {
            rewardArr[i].reward = 2 * (item.amount - 100) + 1 * 50;
          } else {
            rewardArr[i].reward = 0;
          }
        });
        setUserData(rewardArr);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRowDoubleClick = (rowData) => {
    let newData = [];
    setSelectedRow(rowData);
    setDisplayReward(true);
    let filteredArr = userData.filter(
      (item) => item.customer === rowData.customer
    );
    filteredArr.forEach((elem, i) => {
      const index = newData.findIndex((x) => x.month === elem.month);
      if (index !== -1) {
        newData[index].totReward = newData[index].totReward + elem.reward;
      } else {
        newData.push({ month: elem.month, totReward: elem.reward });
      }
    });
    setTotalReward(newData.reduce((acc, o) => acc + parseInt(o.totReward), 0));
    setRewardData(newData);
  };

  return (
    <div className="App">
      <h1>Customer Transaction Data </h1>
      <p>Double click on a row to view the total reward points at the bottom!</p>
      <DataTable
        columns={columns}
        data={userData}
        onRowDoubleClicked={(rowData) => handleRowDoubleClick(rowData)}
        pagination
        striped
      />
      {displayReward && (
        <>
          <h1>Reward Points Per Month for {selectedRow.customer}</h1>
          <DataTable columns={newColumns} data={rewardData} striped />
          <h1>Total Reward Points:{totalReward}</h1>
        </>
      )}
    </div>
  );
}

export default App;
