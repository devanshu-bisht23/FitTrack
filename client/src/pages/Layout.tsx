import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import BottomNav from "../components/BottomNav"


const Layout = () => {
  return (
    <div className="layout-container">
        <Sidebar />
        <div className="flex-1 overflow-y-scroll">
          <Outlet />
        </div>
      <BottomNav />
    </div>
  )
}

export default Layout

// import { Outlet } from "react-router-dom"
// import Sidebar from "../components/Sidebar"
// import BottomNav from "../components/BottomNav"

// const Layout = () => {
//   return (
//     <div className="layout-container">
//       <Sidebar />

//       <div className="flex-1 overflow-y-auto pb-20">
//         <Outlet />
//       </div>

//       <BottomNav />
//     </div>
//   )
// }

// export default Layout