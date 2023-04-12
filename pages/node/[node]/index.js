import Navigation from "../../../components/node/navigation";
import decodeToken from "../../../lib/decodeToken";
import prisma from "../../../lib/prisma";
import { NodeStore } from "../../../states/node";

export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        }
    }
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    );
    const user_data = decodeToken(req.cookies.access_token);
    const node = await prisma.node.findUnique({
        where: {
            id: query.node,
        }
    })
    return { props: { node } }

}

export default function Node({ node }) {
    return (
        <p>{node.name}</p>
    )
}

Node.getLayout = (page) => {
    return (
        <NodeStore.Provider>
            <Navigation>{page}</Navigation>
        </NodeStore.Provider>
    )
}