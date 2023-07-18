import { useState } from "react";

//For TS
interface useMutation {
    loading: boolean;
    data?: object;
    error?: object;
}
type UseMutationResult = [(data: any) => void, {loading:boolean;data:undefined|any;error:undefined|any}];


export default function useMutation(url: string): UseMutationResult{
    // const [state, setState] = useState{
    //     loading: false,
    //     data: undefiend,
    //     error: undefined,
    // }
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<undefined | any>(undefined);
    const [error, setError] = useState<undefined | any>(undefined);

    function mutation(data: any){
        setLoading(true);
        fetch(url, {
            method:"POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(data)
        }).then((response)=>response.json()).catch(()=>{})
        .then((json) => setData(json))
        .catch(setError)
        .finally(()=>setLoading(false));
    };
    return [mutation, {loading, data, error} ];

}