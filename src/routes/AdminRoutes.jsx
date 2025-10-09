import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./AuthRoutes"
import AdminLogin from "../pages/admin/AdminLogin"
import AdminManage from "../pages/admin/AdminManage"
import AddTechnician from "../pages/admin/AddTechnician"
import TechnicianDetail from "../pages/admin/TechnicianDetail"
import AdminTechEdit from "../pages/admin/AdminTechEdit"

export const AdminRoute = (
    <>
    <Route 
    path="/admin/home" 
    element={
        <ProtectedRoute role={"admin"}> 
            <AdminManage />
             </ProtectedRoute>
    }/>
          
          
            <Route path="/admin/add-technician" 
            element={
                <ProtectedRoute role={"admin"}>
                <AddTechnician />
                </ProtectedRoute>
                } />


            <Route 
            path="/admin/login" 
            element={
                <ProtectedRoute role={"admin"} >
            <AdminLogin />
                </ProtectedRoute>

            } />


            <Route 
            path="/admin/technicians/:id" 
            element={
                <ProtectedRoute role={"admin"}>
            <TechnicianDetail />
            </ProtectedRoute>

            } />
            <Route 
            path="/admin/technicians/edit/:id" 
            element={
                <ProtectedRoute role={"admin"}>
            <AdminTechEdit />
            </ProtectedRoute>

            } />
       
 </>
 




) 
