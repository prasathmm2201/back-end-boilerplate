import { MQService } from "..//../extension";
import { Router, Request, Response } from "express";

const AuthRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints related to users
 * /api/auth:
 *   get:
 *     tags: [Auth]
 *     summary: Retrieve a list of JSONPlaceholder users.
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */
AuthRoutes.get("/", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ ...req?.body, ...global.status_codes.success })
    }
    catch (err) {
        res.status(400).send(err)
    }
});

AuthRoutes.post("/email", async (req: Request, res: Response) => {
    try {
        const messageBroker = new MQService();
        await messageBroker.consumeMessage(
            { queue: "email" },
            {
              type: "email",
              to: "prasath@crayond.co",
              data:req?.body?.data,
              email_type:"reset_password",
              subject:"Reset your app password"
            }
          );
        res.status(200).send({ ...req?.body, ...global.status_codes.success })
    }
    catch (err) {
        res.status(400).send(err)
    }
});

export { AuthRoutes }