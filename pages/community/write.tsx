import type { NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";

interface WriteForm {
    question: string;
}

interface WriteResponse {
    ok: boolean;
    post: Post;
}

const Write: NextPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<WriteForm>();
    const [post, {loading, data}] = useMutation<WriteResponse>("/api/posts")
    const onValid = (data: WriteForm) => {
        if(loading) return; //this prevents from loading data more than once when multiple clicks
        post(data)
    };
    useEffect(() => {
        if(data && data.ok){
            router.push(`/community/${data.post.id}`);
        }
    }, [data, router])
    return (
        <Layout canGoBack title="Write Post">
            <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
                <TextArea   register={register("question", {required: true, minLength: 5 })} 
                            required 
                            placeholder="Ask a question!" />
                <Button text={loading? "Loading..." :  "Submit"} />
            </form>
        </Layout>
    );
};

export default Write;