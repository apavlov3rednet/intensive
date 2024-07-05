module.exports.handler = async (event, context) => {
    const {version, session, request} = event;
    //Хранение пользовательских запросов
    let city = getState('city');            //город
    let eventType = getState('eventType');  //тип события
    let eventName = getState('eventName');  //название события
    let location = getState('location');    //местоположение
    let intents = event.request.nlu.intents;

    function getState(name) {
        let state = context._data.state ? context._data.state.session : false; 
        return state[name] ? state[name] : false;
    }

    function make_response(text) {
        return {
            response: {
                text: text,
                
            },
            session_state: {
                city: city,
                eventName: eventName,
                eventType: eventType,
                location: location
            },
            version: '1.0'
        }
    }

    function welcome(event) {
        return make_response('Вас приветсвуте помощник по подбору мероприятий. Куда вы хотели бы сходить?');
    }
    
    function fallback(event) {
        return make_response('Извините, я вас не понял. Переформулируйте свой запрос.');
    }

    function setEventType(event) {
        let intent = event.request.nlu.intents.eventType;
        if(intent) {
            eventType = intent.slots.event.value;
            text = 'На какое время?';
        }
       
    }

    function AboutEvent(event) {
        let intent = event.request.nlu.intents.about_event_info;

        if(intent) {
            let value = intent.slots.event.value;

            switch(value) {
                case "cinema":
    
                break;
    
                case "piece":
    
                break;
    
                default:
                    return fallback();
                break;
            }
        }
    }

    if(event.session.new) {
        return welcome();
    }
    else if(eventType in intents) {
        setEventType();
        AboutEvent();
        //return CurrentEvents();
    }
    else {
        return fallback();
    }

    // if (request["original_utterance"].length > 0) {

    //     //Привязка города
    //     if(context._data.request.nlu.entities.length > 0) {
    //         context._data.request.nlu.entities.forEach(item => {
    //             if(item.type === 'YANDEX.GEO') {
    //                 city = item.value.city;
    //             }
    //         });
    //     }

    //     if(!eventType) {
    //         eventType = request["original_utterance"];
    //     }

    //     if(!city) {
    //         text = 'В каком вы городе?';
    //     }

    //     if(city && eventType && !location) {

    //         switch(eventType) {
    //             case 'кино':
    //                 text = 'В каком кинотеатре?';
    //             break;

    //             case 'театр':
    //                 text = 'В каком театре?';
    //             break;
    //         }
            

    //         location = request["original_utterance"];
    //     }
        
    // }
    // return {
    //     version,
    //     session,
    //     response: {
    //         text: text,
    //         end_session: false
    //     },
    //     test_state: state,
    //     req: request,
    //     context: context,
    //     session: session,
    //     session_state: {
    //         city: city,
    //         eventName: eventName,
    //         eventType: eventType,
    //         location: location
    //     },
    // };
};