import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    const { spaceCode } = req.body;

    if (session) {
        const joined = await prisma.space.findFirst({
            where: {
                group: {
                    code: spaceCode,
                    member: {
                        some: {
                            user: {
                                id: {
                                    equals: session?.user?.id
                                }
                            }
                        }
                    },
                }
            },
        });
        if (!joined) {
            const examples = await prisma.group.update({
                where: {
                    code: spaceCode,
                },
                data: {
                    member: {
                        create: {
                            user: {
                                connect: {
                                    id: session?.user?.id,
                                },
                            },
                            role: "Member",
                        },
                    },
                },
            });
            res.status(200).json(examples);
        } else {
            res.status(200).json(joined);
        }
    } else {
        res.send({
            error:
                "You must be signed in to view the protected content on this page.",
        });
    }
};

export default restricted;
