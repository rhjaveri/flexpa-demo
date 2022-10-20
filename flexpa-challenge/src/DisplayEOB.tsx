import { Patient, ExplanationOfBenefit } from 'fhir/r4';
import React, { useEffect, useMemo, useState } from 'react';

export interface EOBProps {
    patient?: Patient;
    accessToken?: string;
}

export function DisplayEOB({ patient, accessToken }: EOBProps) {
    const [EOB, setEOB] = useState<Array<ExplanationOfBenefit>>([]);
    const [loading, setLoading] = useState(false)

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
            let fhirResponseBody = await fhirExplanationResp.json()
            let resourceList: Array<ExplanationOfBenefit> = fhirResponseBody.entry?.map((entry: any) => entry.resource as ExplanationOfBenefit | undefined);
            let benefitsList: Array<ExplanationOfBenefit> = resourceList.filter(resource => resource.resourceType === 'ExplanationOfBenefit');
            setEOB(benefitsList);
        }
        setLoading(false)
    }

    useEffect(() => {
        if (patient) {
            fetchExplanationOfBenefit();
        }
    }, [patient])

    if (loading) {
        return <h3>Loading Explanation of Benefits</h3>
    }
    else {
        return (
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
        )
    }

}
