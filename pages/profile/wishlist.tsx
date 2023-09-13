import ItemList from "@/components/item-list";
import type { NextPage } from "next";
import Layout from "../../components/layout";
import Product from "../../components/product";

const Wishlist: NextPage = () => {
    return (
        <Layout title="WishList" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
            <ItemList kind="wishLists"/>
            </div>
        </Layout>
    );
};

export default Wishlist