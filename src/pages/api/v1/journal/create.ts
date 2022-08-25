import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    const { groupId, name, description, type, amount, total, space } = req.body;

    if (session) {
        const member = await prisma.member.findFirst({
            where: {
                userId: session?.user?.id,
                groupId: groupId,
            },
            select: {
                id: true,
            }
        });
        const data = await prisma.journal.create({
            data: {
                name: name,
                description: description,
                type: type,
                amount: Number(amount),
                total: Number(total),
                space: {
                    connect: {
                        id: space,
                    },
                },
                member: {
                    connect: {
                        id: member?.id,
                    },
                }
            },
            include: {
                space: true,
            }
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
