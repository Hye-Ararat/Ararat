import decodeToken from "../../../../../../../../../lib/decodeToken.js";
import Permissions from "../../../../../../../../../lib/permissions/index.js";
import prisma from "../../../../../../../../../lib/prisma.js";

export default async function handler(req, res) {
    const { query: { id, instanceUserId, widgetGridId }, method } = req;
    console.log(widgetGridId)
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    if (method == "PUT") {
        let permissions = new Permissions(tokenData.id).instance(id).instanceUser(instanceUserId);
        if (await permissions.editWidgetLayout) {
            let widgets = await prisma.instanceUserWidget.findMany({
                where: {
                    widgetGridId: widgetGridId
                }
            })
            console.log(widgets)
            //delete all widgets
            await prisma.instanceUserWidget.deleteMany({
                where: {
                    widgetGridId: widgetGridId
                }
            })
            //add all widgets
            for (let i = 0; i < req.body.length; i++) {
                let widg = req.body[i];
                await prisma.instanceUserWidget.create({
                    data: {
                        size: widg.size,
                        widget: widg.widget,
                        widgetGrid: {
                            connect: {
                                id: widgetGridId
                            }
                        }
                    }
                })
            }
            //add widgets from previous
            for (let i = 0; i < widgets.length; i++) {
                let widg = widgets[i];
                await prisma.instanceUserWidget.create({
                    data: {
                        size: widg.size,
                        widget: widg.widget,
                        widgetGrid: {
                            connect: {
                                id: widgetGridId
                            }
                        }
                    }
                })
            }
            const newWidgets = await prisma.instanceUserWidget.findMany({
                where: {
                    widgetGridId: widgetGridId
                }
            })
            console.log(newWidgets)
            res.status(200).json({ message: "success" })
        }
    }
    if (method == "PATCH") {
        let permissions = new Permissions(tokenData.id).instance(id).instanceUser(instanceUserId);
        if (await permissions.editWidgetLayout) {
            await prisma.instanceUserWidget.deleteMany({
                where: {
                    widgetGridId: widgetGridId
                }
            })
            for (let i = 0; i < req.body.length; i++) {
                let widg = req.body[i];
                await prisma.instanceUserWidget.create({
                    data: {
                        size: widg.size,
                        widget: widg.widget,
                        widgetGrid: {
                            connect: {
                                id: widgetGridId
                            }
                        }
                    }
                })
            }
            console.timeEnd("e")
            res.status(200).json({ message: "success" })
        }
    }

}