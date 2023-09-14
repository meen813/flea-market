import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import type { NextPage } from "next";
import router from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";

interface EditProfileForm {
    email?: string;
    phone?: string;
    firstName?: string
    lastName?: string
    formErrors?: string;
}

interface EditProfileResponse {
    ok: boolean;
    error?: string;
}


const EditProfile: NextPage = () => {
    const { user } = useUser();
    const { register, setValue, setError, handleSubmit, formState: { errors } } = useForm<EditProfileForm>();
    useEffect(() => {
        if (user?.firstName) setValue("firstName", user.firstName)
        if (user?.firstName) setValue("lastName", user.lastName)
        if (user?.email) setValue("email", user.email)
        if (user?.phone) setValue("phone", user.phone)
    }, [user, setValue])
    const [editProfile, { data, loading }] = useMutation<EditProfileResponse>(`/api/users/user`)
    const onValid = ({ email, phone, firstName, lastName }: EditProfileForm) => {
        if (loading) return; //prevents user from loading too many times
        if (email === "" && phone === "" && firstName === "" && lastName === "") {
            return setError("formErrors",
                { message: "Either an Email or a Phone number is required." })
        };
        editProfile({ email, phone, firstName, lastName });
    }

    useEffect(() => {
        if (data && !data.ok && data.error) {
            setError("formErrors", { message: data.error })
        }
    }, [data, setError])

    return (
        <Layout canGoBack title="Edit Profile">
            <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-full bg-slate-500" />
                    <label
                        htmlFor="picture"
                        className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-gray-700"
                    >
                        Profile Change
                        <input
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
                </div>
                <Input
                    register={register("firstName")}
                    required={false}
                    label="First Name"
                    name="firstName"
                    type="text"
                />
                <Input
                    register={register("lastName")}
                    required={false}
                    label="Last Name"
                    name="LastName"
                    type="text"
                />
                <Input
                    register={register("email")}
                    required={false}
                    label="Email address"
                    name="email"
                    type="email"
                />
                <Input
                    register={register("phone")}
                    required={false}
                    label="Phone number"
                    name="phone"
                    type="number"
                    kind="phone"
                />
                {errors.formErrors ?
                    <span className="my-2 text-red-500 font-medium text-center block">
                        {errors.formErrors.message}
                    </span> : null}
                <Button text={loading ? "Loading..." : "Update profile"} />
            </form>
        </Layout>
    );
};

export default EditProfile;