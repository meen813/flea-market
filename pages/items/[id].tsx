import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import { Item, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Button from "../../components/button";
import Layout from "../../components/layout";

interface ItemWithUser extends Item {
    user: User;
}

interface ItemDetailResponse {
    ok: boolean;
    item: ItemWithUser;
    relatedItems: Item[];
    isLiked: boolean;
}

const ItemDetail: NextPage = () => {

    
    const {user, isLoading } = useUser();
    const router = useRouter();
    const {mutate} = useSWRConfig();
    const { data, mutate:boundMutate } = useSWR<ItemDetailResponse>
        (router.query.id ? `/api/items/${router.query.id}` : null)
    console.log(data)
    const [toggleWishList] = useMutation(`/api/items/${router.query.id}/wishList`)
    const onWishListClick = () => { //implementing a responsive ui for 'like' button, this is 'an optimistic UI update'
        if(!data) return;
        boundMutate({...data, isLiked: !data.isLiked},
                false) // this boolean makes SWR revalidate if it is true
        //example of use of unbound mutation
        // mutate("/api/users/user", (prev: any) => ({ok: !prev.ok}), false)
        toggleWishList({}); // sending a request to the backend
    }
    const deleteItem = async () => {
        try {
            const response = await fetch(`/api/items/${router.query.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('아이템이 삭제되었습니다.');
                router.push('/'); // 예: 아이템이 삭제되면 홈 페이지로 이동
            } else {
                console.error('아이템 삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('아이템 삭제 중 오류가 발생했습니다.', error);
        }
    };
    
    return (
        //create a loading screen for this..  .
        <Layout canGoBack>
            <div className="px-4  py-4">
                <div className="mb-8">
                    <div className="h-96 bg-slate-300" />
                    <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-slate-300" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {data?.item?.user?.firstName} {data?.item?.user?.lastName}
                            </p>
                            <Link href={`/users/profiles/${data?.item?.user?.id}`}>
                                <p className="text-xs font-medium text-gray-500">
                                    View profile &rarr;
                                </p>
                            </Link>
                            
                        </div>
                    </div>
                    <div className="mt-5">
                        <h1 className="text-3xl font-bold text-gray-900">{data?.item?.name}</h1>
                        <span className="text-2xl block mt-3 text-gray-900">$ {data?.item?.price}</span>
                        <p className=" my-6 text-gray-700">
                            {data?.item?.description}
                        </p>
                        <div className="flex items-center justify-between space-x-2">
                            <Button large text="Talk to seller" />
                            {user?.id === data?.item?.user?.id && (
                        <button
                            onClick={deleteItem}
                            className="p-3 rounded-md flex items-center justify-center hover:bg-gray-100 text-red-400 hover:text-red-500"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                            <button
                                onClick={onWishListClick}
                                className={cls(
                                    "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                                    data?.isLiked
                                        ? "text-red-400 hover:text-red-500"
                                        : "text-gray-400 hover:text-gray-500"
                                )}
                            >
                                {data?.isLiked ? 
                                    <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    />
                                    </svg>
                                    : <svg
                                        className="h-6 w-6 "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>

                    <div className=" mt-6 grid grid-cols-2 gap-4">
                        {data?.relatedItems ? (
                            data.relatedItems.map((item) => (
                                <Link href={`/items/${item.id}`} key={item.id}>
                                    <div key={item.id}>
                                        <div className="h-56 w-full mb-4 bg-slate-300" />
                                        <h3 className="text-gray-700 -mb-1">{item.name}</h3>
                                        <span className="text-sm font-medium text-gray-900">${item.price}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <h3>No Similar Items</h3>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ItemDetail;