module.exports.handler = async (event, context) => {
    const {version, session, request} = event;

    let city = false;
    let text = "Привет. На какое мероприятие хочешь?";


    if (request["original_utterance"].length > 0) {

        //Привязка города
        if(context._data.request.nlu.entities.length > 0) {
            context._data.request.nlu.entities.forEach(item => {
                if(item.type === 'YANDEX.GEO') {
                    city = context._data.request.nlu.entities.value.city;
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
        //Добавляем это и дальше на каждой итерации разбираем
        session_state: {
            city: city,
            eventName: null,

        }
    };
};