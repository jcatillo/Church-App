import { AdminNavbar } from "./components/AdminNavbar";
import { Outlet } from "react-router-dom";

export function AdminLayout(){
    return(
        <>
            <AdminNavbar />
            <main>
                <Outlet/>
            </main>
        </>
    )
}