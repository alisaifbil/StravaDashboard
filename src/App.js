import axios from "axios";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [pageNo, setPageNo] = useState(1);
  const [activities, setActivities] = useState([]);
  const [afterTime, setAfterTime] = useState(1546300800);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    // await getLatestAccessTokenFromDB();
    async function fetchAccessToken(){
      await getLatestAccessTokenFromDB();
    }
    fetchAccessToken();
    console.log(accessToken, "-" ,refreshToken,"-" , expiresAt);
    if(new Date(expiresAt*1000) > new Date()){
      console.log("refreshing access token");
      getNewRefreshToken();
    }
  },[]);

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
    axios.post(`${process.env.REACT_APP_OAUTH_LINK}?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=
    ${process.env.REACT_APP_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`)
    .then(response => {console.log(response)});
  }

  const getLatestAccessTokenFromDB = async() => {
    var accessTokenList = [];
    const accessToken = await getDocs(collectionName);
    // console.log(accessToken);
    accessToken.forEach(doc => {
      // console.log(doc.data());
      accessTokenList.push(doc.data());
    });
    accessTokenList.sort((a, b) => {
      return (a.dateAdded > b.dateAdded) ? -1 : ((a.dateAdded < b.dateAdded) ? 1 : 0);
    });
    // console.log(accessTokenList);
    const latestAccessToken = accessTokenList[0].access_token;
    const latestRefreshToken = accessTokenList[0].refresh_token;
    const latestExpiresAt = accessTokenList[0].expires_at;
    setAccessToken(latestAccessToken);
    setRefreshToken(latestRefreshToken);
    setExpiresAt(latestExpiresAt);
  }

  const addAccessTokenToFirebaseDB = async() => {
    try {
      const keyDoc = await addDoc(collectionName, {
        expires_at: 1672863276,
        expires_in: 21600,
        refresh_token: "bb213896e6b4cccdf23ff2724a013f25696911d1" ,
        access_token: "6f81e38d2cc9a4d116473dbafc173409294383f2",
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
      <button onClick={addAccessTokenToFirebaseDB}>Click Me</button>
    </div>
  );
}

export default App;
