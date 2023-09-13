import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

//fetch function will fetch data and return that data.
const fetcher = (url:string) => fetch(url).then((response) => response.json());

interface ProfileResponse {
    ok: boolean;
    profile: User;
}

export default function useUser(){
    const {data, error} = useSWR<ProfileResponse>("/api/users/user")
    const router = useRouter();
    useEffect(() => {
        if(data && !data.ok){ //if user has not logged in, it will redirect to the 'welcome page'
            router.replace("/welcome")
        }
    }, [data, router])

                    // return router.replace("/welcome");

    return { user: data?.profile, isLoading: !data && !error };
}