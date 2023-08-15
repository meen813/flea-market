import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

//fetch function will fetch data and return that data.
const fetcher = (url:string) => fetch(url).then((response) => response.json());

export default function useUser(){
    const {data, error} = useSWR("/api/users/user")
    const router = useRouter();
    useEffect(() => {
        if(data && !data.ok){
            router.replace("/welcome")
        }
    }, [data, router])

                    // return router.replace("/welcome");

    return { user: data?.profile, isLoading: !data && !error };
}