function macroCommand() {
    const tv = {
        open() {console.log('open tv')},
        close() {console.log('close tv')}
    }

    const dvd = {
        open() {console.log('open dvd')},
        close() {console.log('close dvd')}
    }

    const ac = {
        open() {console.log('open AC')},
        close() {console.log('close AC')}
    }

    const genCommand = function (receiver) {
        return {
            execute() {
                receiver.open()
            },
            undo() {
                receiver.undo()
            },
            add() {
                throw new Error('can use add on leaf.')
            }
        }
    }

    const genMacroCommand = function () {
        const cache = []
        return {
            add(command) {
                cache.push(command)
            },

            execute() {
                if (cache.length) {
                    cache.forEach(command => command.execute())
                }
            },

            undo() {
                if (cache.length) {
                    cache.forEach(command => command.undo())
                }
            }
        }
    }

    const tvCommand = genCommand(tv)
    const dvdCommand = genCommand(dvd)
    const acCommand = genCommand(ac)

    const mediaCommand = genMacroCommand()
    mediaCommand.add(tvCommand)
    mediaCommand.add(dvdCommand)

    const totalCommand = genMacroCommand()
    totalCommand.add(mediaCommand)
    totalCommand.add(acCommand)

    totalCommand.execute()
}

macroCommand()
