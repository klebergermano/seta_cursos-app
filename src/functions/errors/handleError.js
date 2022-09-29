function handleError(err) {
    if (err instanceof TypeError) {
        console.log('handle Error (typeError)', error)
        return
    }
    if (err instanceof CustomError) {
        console.log('handle Error (CustomError)', error)
        return
    }
    console.log(err.name);
    console.log(err.errors);
    console.log(err.stack);

}

export default handleError