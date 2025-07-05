function generateNewPassword(){
    const newPassword = (Math.random() + 1)
    .toString(36)
    .substring(2)
    .replace("j", "@")
    .replace("r", "$")
    .replace("5", "*")
    .replace("g", "#")
    return newPassword
}

export {generateNewPassword};