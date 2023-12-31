import useUser from "@/libs/client/useUser";
import { Item, User } from "@prisma/client";
import type { NextPage } from "next";
import useSWR from "swr";
import FloatingButton from "../components/floating-button";
import Product from "../components/product";
import Layout from "../components/layout";
import Head from "next/head";

export interface ItemWithCount extends Item {
  _count:{
    wishList: number;
  }
}

interface ItemsResponse {
  ok: boolean;
  items: ItemWithCount[]
}

const Home: NextPage = () => {
  const {user, isLoading} = useUser();
  const { data } = useSWR<ItemsResponse>("/api/items")
  console.log(data)
  return (
    <Layout title="Home" hasTabBar>
      <Head>
        <title>Home</title>  
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.items?.map((item) => (
          <Product
            id={item.id}
            key={item.id}
            title={item.name}
            price={item.price}
            // comments={1}
            hearts={item._count.wishList}
          />
        ))}
        <FloatingButton href="/items/upload">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;