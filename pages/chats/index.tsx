import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout";

const Chats: NextPage = () => {
    return (
        <Layout hasTabBar title="Chats">
            <div className="divide-y-[1px] ">
                {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
                    <Link legacyBehavior href={`/chats/${i}`} key={i}>
                        <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-slate-300" />
                            <div>
                                <p className="text-gray-700">Steve Oh</p>
                                <p className="text-sm  text-gray-500">
                                    Hello! I will see you soon.
                                </p>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </Layout>
    );
};

export default Chats;