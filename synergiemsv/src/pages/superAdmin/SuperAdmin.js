import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function SuperAdmin() {
    const {id} = useParams()

        return (
            <div className="superChoice">
                <h3><Link to={`/admin/${id}`}>Admin</Link></h3>
                <h3><Link to={`/leader/${id}`}>Leader</Link></h3>
                <h3><Link to={`/user/${id}`}>User</Link></h3>
            </div>
        )
}