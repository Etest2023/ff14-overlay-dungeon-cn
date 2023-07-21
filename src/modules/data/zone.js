const EO = [1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107] //1124
const HoH = [770]
const PotD = [561, 593]//570

function GetZoneKeyById(id) {
    if (EO.includes(id)) return 'EO'
    if (HoH.includes(id)) return 'HoH'
    if (PotD.includes(id)) return 'PotD'
}

export function GetZoneDataById(id) {
    if(!id) return

    const key = GetZoneKeyById(id)
    if(!key) return

    switch (key) {
        case 'EO':
            return {
                getEnemyData: () => import('./EO/enemy'),
                getFloorData: () => import('./EO/floor').then(list=> list?.default?.[EO.indexOf(id)]),
            }
        // case 'HoH': return {getEnemyData: ()=>import('./HoH/enemy'), getFloorData: ()=>import('./HoH/floor')}
        // case 'PotD': return {getEnemyData: ()=>import('./PotD/enemy'), getFloorData: ()=>import('./PotD/floor')}
    }
}
