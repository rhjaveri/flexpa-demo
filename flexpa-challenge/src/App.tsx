import React, { useEffect, useState } from 'react';
import './App.css';
import { Patient } from 'fhir/r4';
import { DisplayEOB } from './DisplayEOB';
import { LoadingText } from './Loading';

declare const FlexpaLink: {
  create: (config: FlexpaCreate) => Record<string, unknown>,
  open: () => Record<string, unknown>
};

interface ExchangeResponse {
  access_token: string;
  expires_in: string;
}

interface FlexpaCreate {
  publishableKey: string;
  onSuccess: (publictoken: string) => any;
}

function App() {
  const [patient, setPatient] = useState<Patient>();
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchAndSetPatient = async (accessToken: string) => {
    setLoading(true)
    const fhirPatientResp = await fetch(`${process.env.REACT_APP_FHIR_URL}/Patient/$PATIENT_ID`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    if (fhirPatientResp.status !== 200) {
      // try clearing the localstorage and reloading page (reload may not be the best solution here)
      localStorage.removeItem("accessToken");
      window.location.reload();
    }
    else {
      let patient: Patient = await fhirPatientResp.json();
      setPatient(patient);
    }
    setLoading(false)
  }

  useEffect(() => {
    function linkData() {
      if (!process.env.REACT_APP_PUBLISHABLE_KEY) {
        console.log("publishable key not defined")
      }
      else {
        FlexpaLink.create({
          publishableKey: process.env.REACT_APP_PUBLISHABLE_KEY,
          onSuccess: async (publicToken: string) => {
            try {
              let apiResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/flexpa-access`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({ "public-token": publicToken }),
              });
              let responseJSON: ExchangeResponse = await apiResponse.json();
              localStorage.setItem("accessToken", responseJSON.access_token)
              setAccessToken(responseJSON.access_token)
              await fetchAndSetPatient(responseJSON.access_token);
            }
            catch (err) {
              console.log("err", err);
            }
          }
        })
      }
    }

    if (!accessToken) {
      // try to get access token from local storage
      let token = localStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
        fetchAndSetPatient(token);
      }
      else {
        linkData();
      }
    }
  }, [accessToken]);

  // open Flexpa Link
  const handleOpen = () => {
    FlexpaLink.open();
  }

  // Show link page if the user doesn't already have an access token
  return (
    <>
      <div className="App">
        {loading ? <LoadingText text='Patient Data' /> :
          // display information if access token is already set
          (patient && accessToken) ? <DisplayEOB patient={patient} accessToken={accessToken} /> :
            <div>
              <h3 style={{ fontSize: "70px", fontWeight: "600" }}> Rohil Health</h3>
              <p>Before we can display your health information, you need to link your health data with Rohil Health</p>
              <button style={{ backgroundColor: "transparent", width: 500, fontSize: 20, height: 50 }} onClick={handleOpen}>Link My Plan Data</button>
            </div>
        }
      </div>
    </>
  );
}

export default App;
