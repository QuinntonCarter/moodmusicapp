import { Redirect, Route } from "react-router-dom";

export default function ProtectedRoute(props){
    const { path, redirectTo, component: C, token, ...rest } = props
    return token ? 
    <Route path={path} render={() => <C {...rest}/>} />
    :
    <Redirect to={redirectTo} />
}