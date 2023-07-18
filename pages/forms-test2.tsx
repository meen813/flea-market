import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

// have control over inputs
// Dont deal with events
// easier inputs 

//becuase you are using TS...
interface LoginForm {
    username: string;
    password: string;
    email: string;
    errors?: string;
}


export default function Forms() {
    const { register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setError,
        reset,
        resetField,
    } = useForm<LoginForm>({
        mode: "onBlur",
    });
    const onValid = (data: LoginForm) => {
        console.log("I am valid")
        setError("username", {message:"taken username"} )
        // reset();
        resetField("password")
    };
    const onInvalid = (errors: FieldErrors) => {
        console.log(errors);
    }
    

    // setValue("username", "hello")

    // setValue("email", "NoGmail")

    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input
                {...register('username', {
                    required: "Username is required",
                    minLength: {
                        message: "The username should be longer than 5 chars.",
                        value: 5,
                    },
                })}
                type="text"
                placeholder="Username"
            />
            {errors.username?.message}

            <input
                {...register('email', {
                    required: "Email is required",
                    validate: {
                        notGmail: (value) => !value.includes("@gmail.com") || "Gmail is not allowed",
                    },
                })}
                type="email"
                placeholder="Email"
                className={`${Boolean(errors.email?.message) ? "border-red-500" : ""}`}
            />
            {errors.email?.message}
            <input
                {...register('password', { required: "Password is required" })}
                type="password"
                placeholder="Password"
            />
            <input type="submit" value="Create Account" />
            {errors.errors?.message}
        </form>
    )
}