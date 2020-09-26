const { format, parseISO } = require('date-fns');

const clientDateFormat = (date) => {
    try {
        return format(new Date(date), 'MM/dd/yyyy')

    } catch (error) {
        throw error;
    }
}

const clientTaskStatusFormat = (completed) => {
    try {
        switch (completed) {
            case true:
                return 'Done'

            case false:
                return 'To Do'

            default:
                throw new Error('Invalid task.completed value.')
        }

    } catch (error) {
        throw error;
    }
}

module.exports = { clientDateFormat, clientTaskStatusFormat }


