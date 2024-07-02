module.exports.handler = async (event, context) => {
    const {version, session, request} = event;

    let city = false;
    let text = "Привет. На какое мероприятие хочешь?";


    if (request["original_utterance"].length > 0) {

        //Привязка города
        if(context._data.request.nlu.entities.length > 0) {
            context._data.request.nlu.entities.forEach(item => {
                if(item.type === 'YANDEX.GEO') {
                    
                }
            });
        }


        if(!city) {
            text = 'В каком вы городе?';
        }
        else {
            text = request["original_utterance"];
        }
        
    }
    return {
        version,
        session,
        response: {
            text: text,
            end_session: false
        },
    };
};