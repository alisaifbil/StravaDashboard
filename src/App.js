import axios from "axios";
import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [pageNo, setPageNo] = useState(1);
  const [activities, setActivities] = useState([]);
  const [afterTime, setAfterTime] = useState(1546300800)

  const collectionName = collection(db, "stravakeys");
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


  const getNewRefreshToken = () => {
    
  }

  const getAccessToken = async() => {
    var accessTokenList;
    const accessToken = await getDocs(collectionName);
    accessToken.forEach(doc => {
      accessTokenList.push(doc.data());
    });
    accessTokenList.sort((a, b) => {
      return (a.dateAdded > b.dateAdded) ? -1 : ((a.dateAdded < b.dateAdded) ? 1 : 0);
    });

    const latestAccessToken = accessTokenList[0].access_token;
    const latestRefreshToken = accessTokenList[0].refresh_token;
  }

  const addAccessToken = async() => {
    try {
      const keyDoc = await addDoc(collectionName, {
        expires_at: 1672175775,
        expires_in: 21600,
        refresh_token: "2af5ccd63e11220c487250e4d1c7e8ac34526ed7" ,
        access_token: "5253fefdb226196d5d8a6d16126e7c49c06fe131",
        dateAdded : new Date().toISOString() 
      });
      console.log("Document written with ID: ", keyDoc.id);
    }
    catch(error) {
      console.log("some error ", error);
    }
  }


  return (
    <div>
      <button onClick={addAccessToken}>Click Me</button>
    </div>
  );
}

export default App;
