import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
import { Dashboard } from "../pages/Dashboard";
import { Error } from "../pages/Error";


const LazyDashboard = lazy(()=>import('../pages/Dashboard').then(() => ({default:  Dashboard})));
const LazyError = lazy(()=>import('../pages/Error').then(() => ({default:  Error})));

export const RuteoPrincipal = ()=>{
    return (
        <Routes>
            <Route path="/dashboard" element={<LazyDashboard />} />


            {/*********OBLIGATORIAS********* */}
            <Route path="/" element={<LazyDashboard/>}></Route>

            <Route path="*" element={<LazyError/>}></Route>

        </Routes>
    )


    
}