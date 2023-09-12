import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { Post, User, Comment } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

interface CommentWithUser extends Comment {
    user: User;
}

interface PostWithUser extends Post {
    user: User;
    _count: {
        comments: number,
        likeComment: number;
    };
    comments: CommentWithUser[];
}

interface CommunityPostResponse {
    ok: boolean,
    post: PostWithUser;
    isLiked: boolean;

}

interface CommentForm {
    commentText: string;
}

interface CommentResponse {
    ok: boolean;
    response: Comment;
}

const CommunityPostDetail: NextPage = () => {
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm<CommentForm>()
    const { data, mutate } = useSWR<CommunityPostResponse>(
        router.query.id ? `/api/posts/${router.query.id}` : null
    );
    const [like, {loading}] = useMutation(`/api/posts/${router.query.id}/like`)
    const [sendComment, {data: commentData, loading: commentLoading} ] = useMutation<CommentResponse>(`/api/posts/${router.query.id}/comments`)
    const onLikeClick = () => {
        if (!data) return;
        mutate({
            ...data, post: {
                ...data?.post, _count: {
                    ...data.post._count,
                    likeComment: data?.isLiked ? data?.post._count.likeComment - 1 : data?.post._count.likeComment + 1,
                },
            },
            isLiked: !data.isLiked,
        }, false); // false prevents from revalidating
        if(!loading) { // to prevent from 'race condtion'
            like({}); //back-end
        }
    }

    const onValid = (form: CommentForm) => {
        console.log(form)
        if(commentLoading) return;
        sendComment(form);
    }

    useEffect(()=> {
        if(commentData && commentData.ok) {
            reset()
            mutate();
        }
    }, [commentData, reset, mutate])

    return (
        <Layout canGoBack>
            <div>
                <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Question
                </span>
                <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-300" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            {data?.post?.user.firstName} {data?.post?.user.lastName}
                        </p>
                        <Link href={`users/profiles/${data?.post?.user?.id}`}>
                            <p className="text-xs font-medium text-gray-500">
                                View profile &rarr;
                            </p>
                        </Link>

                    </div>
                </div>
                <div>
                    <div className="mt-2 px-4 text-gray-700">
                        <span className="text-blue-500 font-medium">Q.</span> {data?.post?.question}
                    </div>
                    <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
                        <button
                            onClick={onLikeClick}
                            className={cls("flex space-x-2 items-center text-sm", data?.isLiked? "text-blue-500": "")}>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <span> {data?.post?._count.likeComment === 1 ? 'like' : 'likes'} {data?.post?._count.likeComment}</span>
                        </button>
                        <span className="flex space-x-2 items-center text-sm">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                ></path>
                            </svg>
                            <span> {data?.post?._count.comments} {data?.post?._count.comments === 1 ? 'comment' : 'comments'} </span>
                        </span>
                    </div>
                </div>
                <div className="px-4 my-5 space-y-5">
                    {data?.post?.comments.map((comment) => (<div className="flex items-start space-x-3">
                        <div key={comment.id} className="w-8 h-8 bg-slate-200 rounded-full" />
                        <div>
                            <span className="text-sm block font-medium text-gray-700">
                                {comment.user.firstName} {comment.user.lastName}
                            </span>
                            {/* <span className="text-xs text-gray-500 block ">{comment.createdAt.toString()}</span> */}
                            <p className="text-gray-700 mt-2">
                                {comment.commentText}
                            </p>
                        </div>
                    </div>))}
                </div>
                <form className="px-4" onSubmit={handleSubmit(onValid)}>
                    <TextArea
                        name="description"
                        placeholder="Answer this question!"
                        required
                        register={register("commentText", {required: true, minLength: 3})}
                    />
                    <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none ">
                        {commentLoading ? "Loading..." : "Reply"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default CommunityPostDetail;