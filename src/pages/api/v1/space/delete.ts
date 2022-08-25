import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    const { id } = req.body;

    if (session) {
        const deleted = await prisma.space.delete({
            where: {
                id: id
            },
            select:{
                group: {
                    select: {
                        member: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            }
        });
        //not a best practice, 
        await prisma.member.deleteMany({
            where:{
                id:{
                    in: deleted?.group?.member?.map(member => member.id)
                }
            }
        })
        res.status(200).json(deleted);
    } else {
        res.send({
            error:
                "You must be signed in to view the protected content on this page.",
        });
    }
};

export default restricted;
