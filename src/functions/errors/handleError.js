function handleError(err) {
    if (err instanceof TypeError) {
        console.log(error)
        return
    }
    if (err instanceof CustomError) {
        console.log(error)
        return
    }
    console.log(err.name);
    console.log(err.errors);
    console.log(err.stack);

}

export default HandleError