import { useState } from "react";

//제네릭 타입 T를 사용하여 뮤테이션 상태를 정의하는 인터페이스. loading, data, error를 포함.
interface UseMutationState<T> {
    loading: boolean;
    data?: T;
    error?: object;
}
//UseMutationResult 타입은 뮤테이션 함수와 상태를 배열로 묶어 나타냄. 배열의 첫 번째 요소는 뮤테이션 함수, 두 번째 요소는 뮤테이션 상태.
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(url: string): UseMutationResult<T> {
    const [state, setSate] = useState<UseMutationState<T>>({
        loading: false,
        data: undefined,
        error: undefined,
    });
    function mutation(data: any) {
        setSate((prev) => ({ ...prev, loading: true }));
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json().catch(() => { }))
            .then((data) => setSate((prev) => ({ ...prev, data })))
            .catch((error) => setSate((prev) => ({ ...prev, error })))
            .finally(() => setSate((prev) => ({ ...prev, loading: false })));
    }
    return [mutation, { ...state }];
}   