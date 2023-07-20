const {addOverlayListener, startOverlayEvents} = window

let userId = ''
let enemyStore = {}

export default function init({
    onLogEvent,
    ChangeZone,
    
}){
    addOverlayListener('onPlayerChangedEvent', data=>{
        if(userId) return

        const {id} = data.detail ?? {}
        if(!id) return

        userId = id.toString(16).toUpperCase()
    })
    addOverlayListener("onLogEvent", (data)=>{
        const {
            detail: {
                logs = []
            }
        } = data
        // console.log(logs)
        logs.forEach(str=>{
            if(!str) return
            const regx = /^.{14} (?<type>[\w]+) (?<info>.+)/
            const {groups} = str.match(regx) ?? {}
            const {type, info} = groups ?? {}
            if(['AddCombatant'].includes(type)){
                const regx = /^03:(?<targetId>\w+):(?<targetName>[^:]+):.{5}:0000:.{3}:(?<typeId>\w+):/
                const matches = info.match(regx) ?? {}
                if(!matches) return

                const {typeId, targetId} = matches.groups || {}
                enemyStore[targetId] = typeId
            }
            if(type === '261'){
                //切换目标
                const regx = /^105:Change:(?<personId>\w+):TargetID:(?<targetId>\w+):/
                const {groups} = info.match(regx) ?? {}
                const {personId, targetId} = groups || {}
                if(personId === userId){
                    const typeId = enemyStore[targetId]
                    onLogEvent('Change', typeId)
                }

                //目标死亡
                const regx2 = /^105:Change:(?<targetId>[^:]+).*?:CurrentMP:0/
                const {groups: {targetId: id}} = info.match(regx2) ?? {groups: {}}
                if(id && enemyStore[id]) onLogEvent('Death')
            }
            if(type === 'ChatLog'){
                const regx = /^00:.{6}成功进行了传送！/
                if(regx.test(info)) ChangeZone()
            }
        })
    });
    addOverlayListener("ChangeZone", zone=>{
        enemyStore = {}
        console.log(zone)
        ChangeZone(zone.zoneID)
    });
    startOverlayEvents()
}