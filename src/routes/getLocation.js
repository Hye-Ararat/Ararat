import { useLocation } from "react-router";

function GetLocation(){
  const location = useLocation()
  console.log(location.pathname)
  return 'yes'
}

export default GetLocation