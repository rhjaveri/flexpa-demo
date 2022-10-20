import { Patient, ExplanationOfBenefit } from 'fhir/r4';
import React, { useEffect, useMemo, useState } from 'react';
import { LoadingText } from './Loading';

export interface EOBProps {
    patient?: Patient;
    accessToken?: string;
}

export function DisplayEOB({ patient, accessToken }: EOBProps) {
    const [EOB, setEOB] = useState<Array<ExplanationOfBenefit>>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const fetchExplanationOfBenefit = async () => {
        setLoading(true)
        if (patient && accessToken) {
            // check patient ID exists before making request
            const fhirExplanationResp = await fetch(`${process.env.REACT_APP_FHIR_URL}/ExplanationOfBenefit/?patient=${patient.id}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            });
            if (fhirExplanationResp.status === 200) {
                let fhirResponseBody = await fhirExplanationResp.json()
                let resourceList: Array<ExplanationOfBenefit> = fhirResponseBody.entry?.map((entry: any) => entry.resource as ExplanationOfBenefit | undefined);
                let benefitsList: Array<ExplanationOfBenefit> = resourceList.filter(resource => resource.resourceType === 'ExplanationOfBenefit');
                setEOB(benefitsList);
            }
            else {
                console.log("Error Retrieving Explanation of Benefits!")
            }

        }
        setLoading(false)
    }

    useEffect(() => {
        if (patient) {
            fetchExplanationOfBenefit();
        }
    }, [patient])

    return (
        <>
            {loading ? (<LoadingText text='Explanation of Benefits' />) :
                <div>

                    <h2 style={{ padding: "15px" }}>Explanation of Benefits</h2>
                    {EOB.map((entry) => (
                        <div style={{ borderWidth: "3px", padding: "15px", borderStyle: "solid", borderColor: "black" }} key={entry.id}>
                            <h4 >ID: {entry.id}</h4>
                            <p>Provider: {entry.provider.display}</p>
                            <p>Perscription: {entry.prescription?.display}</p>
                            <p>Insurer: {entry.insurer.display}</p>
                            <p>Last Updated: {entry.meta?.lastUpdated}</p>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}
