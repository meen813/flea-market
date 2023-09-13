import ItemList from "@/components/item-list";
import { Item } from "@prisma/client";
import type { NextPage } from "next";
import Layout from "../../components/layout";


const Sold: NextPage = () => {
    
    return (
        <Layout title="Sales History" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ItemList kind="salesLists"/>
            </div>
        </Layout>
    );
};

export default Sold;