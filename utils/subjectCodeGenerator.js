// Generates 7 digit code for the subject
module.exports = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    let code = ''
    for (let i = 0; i < 7; i++) {
        const num = Math.floor(Math.random() * chars.length)
        code += chars[num]
    }
    return code
}