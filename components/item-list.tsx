import { ItemWithCount } from "@/pages";
import useSWR from "swr";
import Product from "./product";

interface ItemListProps {
    kind: "wishLists" | "salesLists" | "purchasedHistories"
}

interface History {
    id: number;
    item: ItemWithCount;
}

interface ItemListResponse {
    [key: string]: History[]
}


export default function ItemList({ kind }: ItemListProps) {
    const { data } = useSWR<ItemListResponse>(`/api/users/user/${kind}`)
    return data ?
        <>
            {data[kind]?.map((history) => (
                <Product
                    id={history.item.id}
                    key={history.id}
                    title={history.item.name}
                    price={history.item.price}
                    hearts={history.item._count.wishList}
                />
            ))}
        </>
        : null;
}
