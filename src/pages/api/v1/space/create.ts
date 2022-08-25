import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    const { name, description } = req.body;

    if (session) {
        const examples = await prisma.space.create({
            data: {
                name: name,
                description: description,
                group: {
                    create: {
                        member: {
                            create: {
                                user: {
                                    connect: {
                                        id: session?.user?.id,
                                    },
                                },
                                role: "Owner",
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                updatedAt: true,
            }
        });
        res.status(200).json(examples);
    } else {
        res.send({
            error:
                "You must be signed in to view the protected content on this page.",
        });
    }
};

export default restricted;
