import express from "express";
import { AuthRoutes } from "./auth";
import { CountryMaterRoutes } from "./country_master";

const routers = express.Router();

type Routes = {
    path: string;
    route: any;
}[];

const publicRoutes: Routes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
];

const privateRoutes: Routes = [
    {
        path: "/country_master",
        route: CountryMaterRoutes,
    },
];

publicRoutes.forEach((route)=>{
    routers.use(route.path , route.route)
})
privateRoutes.forEach((route)=>{
    routers.use(route.path , route.route)
})

export default routers;
