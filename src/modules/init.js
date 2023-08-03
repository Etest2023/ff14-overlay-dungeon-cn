const { addOverlayListener, startOverlayEvents } = window

let userId = ''
let enemyStore = {}

export default function init({ onLogEvent, ChangeZone }) {
    addOverlayListener('ChangePrimaryPlayer', (data) => {
        if (userId) return

        const { charID } = data ?? {}
        if (!charID) return

        userId = charID.toString(16).toUpperCase()
    })
    addOverlayListener('LogLine', (data) => {
        const { line } = data
        if (!line) return
        // console.log(line)
        const lineType = line[0]
        const type = line[2]
        if (lineType === '03') {
            //储存敌对目标
            const targetId = line[2]
            const isEnemy = line[6] === '0000'
            const typeId = line[9]
            if (isEnemy) enemyStore[targetId] = typeId || -1
        } else if (lineType === '261') {
            if (type === 'Change') {
                //切换目标
                const personId = line[3]
                if (personId === userId) {
                    const foundIndex = line.findIndex(
                        (str) => str === 'PCTargetID',
                    )
                    if (foundIndex > -1) {
                        const targetId = line[foundIndex + 1]
                        const typeId = enemyStore[targetId]
                        onLogEvent('Change', typeId)
                    }
                }
            }
        } else if (lineType === '00') {
            if (line[4] === '成功进行了传送！') ChangeZone()
        } else if (['37', '38'].includes(lineType)) {
            //目标死亡，HP归零法
            const targetId = line[2]
            const isZero = line[5] === '0'
            if (isZero && targetId && enemyStore[targetId]) {
                delete enemyStore[targetId] // 避免重复
                onLogEvent('Death')
            }
        }
    })
    addOverlayListener('ChangeZone', (zone) => {
        enemyStore = {}

        ChangeZone(zone.zoneID)
    })
    startOverlayEvents()
}
