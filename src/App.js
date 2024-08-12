import "./App.css";
import { useEffect, useState } from "react";
import { rewardPointsPerTrans, monthNames } from "./utils/Rewards";

const columns = [
  "Customer",
  "Date(MM-DD-YYYY)",
  "Amount($)",
  "Month",
  "Reward Point/Transaction",
];

const newColumns = ["Customer", "Month", "Reward Points/Month"];

function App() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayReward, setDisplayReward] = useState(false);
  const [monthRewards, setMonthRewards] = useState([]);
  const [total, setTotal] = useState({});

  const getSearchResult = async () => {
    let response;
    try {
      // I have added a fake api with the desired json response.Please refer to SampleResponse.json file to view the response.
      response = await fetch("https://dummyjson.com/c/21ce-b685-43a7-a372");
    } catch (error) {
      setLoading(false);
      alert("error");
    }
    if (response?.ok) {
      setLoading(false);
      const resp = await response.json();
      setUserData(resp);
    } else {
      setLoading(false);
      alert(`error code: ${response?.status}`);
    }
  };

  useEffect(() => {
    getSearchResult();
  }, []);

  const handleMonthlyData = () => {
    userData.reduce((acc, cur) => {
      const found = acc.find(
        (val) =>
          monthNames[new Date(val.date).getMonth()] ===
            monthNames[new Date(cur.date).getMonth()] &&
          val.customer === cur.customer
      );
      if (found) {
        found["monthlyRewards"] =
          rewardPointsPerTrans(found) + Number(rewardPointsPerTrans(cur));
      } else {
        acc.push({ ...cur, monthlyRewards: Number(rewardPointsPerTrans(cur)) });
      }
      setMonthRewards(acc);
      return acc;
    }, []);
  };

  const getTotal = (e) => {
    const result = {};
    monthRewards.forEach((input) => {
      if (input.customer === e.target.innerHTML) {
        if (result["tot"]) {
          result["tot"] = result["tot"] + input.monthlyRewards;
        } else {
          result["tot"] = input.monthlyRewards;
        }
        result["customer"] = e.target.innerHTML;
      }
    });
    setTotal(result);
  };

  return (
    <div className="App">
      {loading && <div className="loader" />}
      {displayReward ? (
        <>
          <button onClick={() => setDisplayReward(false)}>
            Back to main page
          </button>
          <h1>Customer Reward Points Per Month</h1>
          <table className="data-table-container">
            <thead>
              <tr>
                {newColumns.map((item) => {
                  return <th key={item}>{item}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {monthRewards.map((data) => {
                return (
                  <tr>
                    <td>
                      <button onClick={(e) => getTotal(e)}>
                        {data.customer}
                      </button>
                    </td>
                    <td>{monthNames[new Date(data.date).getMonth()]}</td>
                    <td>{data.monthlyRewards}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h1>Total Reward Points for {total.customer} :{total.tot}</h1>
        </>
      ) : (
        <>
          <h1>Customer Transaction Data </h1>
          <table className="data-table-container" id="tableID">
            <thead>
              <tr>
                {columns.map((item) => {
                  return <th key={item}>{item}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {userData.map((data) => {
                return (
                  <tr>
                    <td>{data.customer}</td>
                    <td>{data.date}</td>
                    <td>{data.amount}</td>
                    <td>{monthNames[new Date(data.date).getMonth()]}</td>
                    <td>{rewardPointsPerTrans(data)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            onClick={() => {
              setDisplayReward(true);
              handleMonthlyData();
            }}
          >
            View Monthly Data
          </button>
        </>
      )}
    </div>
  );
}

export default App;
