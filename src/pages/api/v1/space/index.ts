import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, nextAuthOptions);

    if (session) {
        const data = await prisma.space.findMany({
            where: {
                group: {
                    member:{
                        some:{
                            user:{
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
                        code: true,
                        member: {
                            where: {
                                user: {
                                    id: {
                                        equals: session?.user?.id
                                    }
                                }
                            },
                            select: {
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        type Type = typeof data

        res.status(200).json(data);
    } else {
        res.send({
            error:
                "You must be signed in to view the protected content on this page.",
        });
    }
};

export default restricted;
