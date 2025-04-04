import { CreateurGroupe } from "./subComponents/CreateurGroupe"
import { GroupeList } from "./subComponents/GroupeList"

export function GestionGroupe() {
  return (
    <div className="gestionGroupe pt-20">
      <h2>Gestion des groupes de formations</h2>
      <CreateurGroupe />
      <GroupeList />
    </div>
  )
}

