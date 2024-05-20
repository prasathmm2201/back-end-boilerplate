import { Router, Response, Request } from 'express'

const CountryMaterRoutes = Router()

CountryMaterRoutes.get('/', (req: Request, res: Response) => {
    try {
        res.status(200).send({...req?.body , ...global.status_codes.success})
    }
    catch (err) {
        res.status(400).send(err)
    }
})

export {CountryMaterRoutes}