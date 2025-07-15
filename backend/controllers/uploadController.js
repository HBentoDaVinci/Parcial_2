const uploadController = (request, response) => {
    try{
        if(!request.file){
            return response.status(422).json({msg: 'No se subio el archivo'})
        }
        return response.status(200).json({msg: 'Archivo subido', file: request.file})

    }
    catch(error){
        console.error({error})
        response.status(500).json({msg: 'Error del servidor', data: []});
    }

}
export {uploadController}