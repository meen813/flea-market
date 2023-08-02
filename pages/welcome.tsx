import useMutation from "@/libs/client/useMutation";
import type { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/button";
import Input from "../components/input";
import { cls } from "../libs/client/utils";


interface WelcomeForm {
    email?: string;
    phone?: any;
}

interface TokenForm {
    token: string;
}

interface MutationResult {
    ok: boolean;
}

const Welcome: NextPage = () => {
    const [welcome, { loading, data, error }] =
        useMutation<MutationResult>("/api/users/welcome");
    const [confirmToken, { loading: tokenLoading, data: tokenData }] =
        useMutation<MutationResult>("/api/users/confirm");
    const { register, handleSubmit, reset } = useForm<WelcomeForm>();
    const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
        useForm<TokenForm>();
    const [method, setMethod] = useState<"email" | "phone">("email");
    const onEmailClick = () => {
        reset()
        setMethod("email")
    };
    const onPhoneClick = () => {
        reset()
        setMethod("phone")
    };

    const onValid = (validForm: WelcomeForm) => {
        if (loading) return;
        welcome(validForm);
    };

    const onTokenValid = (validForm: TokenForm) => {
        if (tokenLoading) return;
        confirmToken(validForm);
    }

    console.log(data);
    return (
        <div className="mt-16 px-4">
            <h3 className="text-3xl font-bold text-center">
                Welcome to Treasure Trove
            </h3>
            <div className="mt-12">
                {data?.ok ? (
                    <form
                        onSubmit={tokenHandleSubmit(onTokenValid)}
                        className="flex flex-col mt-8 space-y-4"
                    >
                        <Input
                            register={tokenRegister("token", {
                                required: true
                            })}
                            name="token"
                            label="Please confirm your token"
                            type="number"
                            required
                        />
                        <Button text={tokenLoading ? "Loading" : "Confirm Token"} />
                    </form>
                ) : (
                    <>
                        <div className="flex flex-col items-center">
                            <h5 className="text-sm text-gray-500 font-medium">
                                Enter using:
                            </h5>
                            <div className="grid  border-b  w-full mt-8 grid-cols-2 ">
                                <button
                                    className={cls(
                                        "pb-4 font-medium text-sm border-b-2",
                                        method === "email"
                                            ? " border-blue-500 text-blue-400"
                                            : "border-transparent hover:text-gray-400 text-gray-500"
                                    )}
                                    onClick={onEmailClick}
                                >
                                    Email
                                </button>
                                <button
                                    className={cls(
                                        "pb-4 font-medium text-sm border-b-2",
                                        method === "phone"
                                            ? " border-blue-500 text-blue-400"
                                            : "border-transparent hover:text-gray-400 text-gray-500"
                                    )}
                                    onClick={onPhoneClick}
                                >
                                    Phone
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onValid)} className="flex flex-col mt-8 space-y-4">
                            {method === "email" ? (
                                <Input
                                    register={register("email", { required: true })}
                                    name="email"
                                    label="Email address"
                                    type="email"
                                    required
                                />
                            ) : null}
                            {method === "phone" ? (
                                <Input
                                    register={register("phone", { required: true })}
                                    name="phone"
                                    label="Phone number"
                                    type="number"
                                    kind="phone"
                                    required //중복?
                                />
                            ) : null}
                            {method === "email" ? (
                                <Button text={loading ? "loading?" : "Get login link"} />
                            ) : null}
                            {method === "phone" ? (
                                <Button text={loading ? "Loading" : "Get one-time password"} />
                            ) : null}
                        </form>
                    </>
                )}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute w-full border-t border-gray-300" />
                        <div className="relative -top-3 text-center ">
                            <span className="bg-white px-2 text-sm text-gray-500">
                                Or enter with
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mt-2 gap-3">
                        <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                            </svg>
                        </button>
                        <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Welcome;