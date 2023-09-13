import type { NextPage } from "next";
import Product from "../../components/product";
import Layout from "../../components/layout";
import ItemList from "@/components/item-list";

const purchased: NextPage = () => {
    return (
        <Layout title="Order History" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
            <ItemList kind="purchasedHistories"/>
            </div>
        </Layout>
    );
};

export default purchased;