import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

interface WriteForm {
    question: string;
}

const Write: NextPage = () => {
    const { register, handleSubmit } = useForm<WriteForm>();
    const onValid = (data: WriteForm) => {
        console.log(data)
    };
    return (
        <Layout canGoBack title="Write Post">
            <form className="p-4 space-y-4">
                <TextArea required placeholder="Ask a question!" />
                <Button text="Submit" />
            </form>
        </Layout>
    );
};

export default Write;