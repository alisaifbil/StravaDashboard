// import {CLIENT_ID ,CLIENT_SECRET, ACCESS_TOKEN} from process.env;
import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [pageNo, setPageNo] = useState(1);
  const [activities, setActivities] = useState([]);
  const [afterTime, setAfterTime] = useState(1546300800)

  const getAllActivities = () => {
    axios
      .get(
        `${process.env.REACT_APP_ACTIVITY_LINK}?access_token=${process.env.REACT_APP_ACCESS_TOKEN_GEN}&after=${afterTime}&per_page=200&page=${pageNo}`
      )
      .then((response) => {
        // console.log(response.data);
        var activityArr = response.data;
        // console.log(activityArr, "---", activityArr.length);
        activityArr.sort((a, b) => {
          return new Date(b.start_date) - new Date(a.start_date);
        });
        // console.log(activityArr, "---", activityArr[0].start_date);
        let newAfterTime = new Date(activityArr[0].start_date).getTime()/1000;
        setAfterTime(newAfterTime);
        // console.log(newAfterTime);
        setActivities([...activities, activityArr]);
        // setPageNo(2);
        // if (activityArr.length === 200) {
        //   // setActivities(activityArr);
        //   axios
        //     .get(
        //       `${process.env.REACT_APP_ACTIVITY_LINK}?access_token=${process.env.REACT_APP_ACCESS_TOKEN_GEN}&after=${afterTime}&per_page=200&page=1`
        //     )
        //     .then((result) => {
        //       console.log(result.data);
        //       activityArr.concat(result.data); 
        //       console.log(activityArr, "---", activityArr.length);
        //       setActivities([...activities, activityArr]);
        //     });
        // } else {
        //   setActivities([...activities, activityArr]);
        // }
      });
  };

  return (
    <div>
      <button onClick={getAllActivities}>Click Me</button>
    </div>
  );
}

export default App;
