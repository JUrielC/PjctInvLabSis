const return_error = (codigo, mensaje) => {
    return {
        'ok': false,
        'message': {
            'status': codigo,
            'error_text': mensaje
        }
    };
}

module.exports = return_error
