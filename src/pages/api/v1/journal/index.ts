import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (session) {
        const data = await prisma?.space.findMany({
            where: {
                group: {
                    member: {
                        some: {
                            user: {
                                id: {
                                    equals: session?.user?.id
                                }
                            }
                        }
                    }
                }
            },
            include: {
                group: {
                    select: {
                        id: true,
                    },
                },
                journal: true,
            },
        });
        res.status(200).json(data);
    } else {
        res.send({
            error:
                "You must be signed in to view the protected content on this page.",
        });
    }
};

export default restricted;
