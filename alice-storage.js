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

    function button(title, payload = false, url = false, hide = false) {
        let button = {
            title: title,
            hide: hide
        }

        if(payload) {
            button.payload = payload;
        }

        if(url) {
            button.url = url;
        }

        return button;
    }

    function make_response(options = {
        text: '',
        state: {},
        buttons: []
    }) {
        if(options.text.length == 0) {
            options.text = 'Задайте свой вопрос';
        }

        return {
            response: {
                text: options.text,
                buttons: options.buttons || [],
            },
            session_state: {
                city:  city,
                eventName:  eventName,
                eventType:  eventType,
                location:  location,
                intents: intents
            },
            version: '1.0'
        }
    }

    function welcome(event) {
        if(city) {
            return make_response({
                text: 'Вас приветсвуте помощник по подбору мероприятий. Куда вы хотели бы сходить?',
                buttons: [
                    button('В кино', false, false, true),
                    button('В театр', false, false, true),
                    button('На концерт', false, false, true),
                ]
            });
        }
        else {
            //todo: Дописать запрос геолокации
            return make_response({
                text: 'Вас приветсвуте помощник по подбору мероприятий. Куда вы хотели бы сходить?',
                buttons: [
                    button('В кино', false, false, true),
                    button('В театр', false, false, true),
                    button('На концерт', false, false, true),
                ]
            });
        }
    }
    
    function fallback(event, methodName) {
        return make_response({
            text: `Извините, я вас не понял. Переформулируйте свой запрос. ${methodName}`
        });
    }

    function AboutType(event) {
            eventType = intent.slots.event.value;
            text = 'На какое время?';
            return make_response({text: text})
    }

    function ChoiceEvent(event) {
            let value = request.nlu.intents.choice_event.slots.event.value;

            let state = {
                eventType: value
            }

            switch(value) {
                case "cinema":
                    return make_response({
                        text: 'В какой кинотеатр?', 
                        state: state
                    });
                break;
    
                case "piece":
                    return make_response({
                        text: 'В какой театр?', 
                        state: state
                    });
                break;

                case "concert":
                    return make_response({
                        text: 'На какой концерт вы хотели бы сходить?', 
                        state: state
                    });
                break;
    
                default:
                    return false
                break;
            }
    }

    if(event.session.new) {
        return welcome();
    }
    else if(Object.keys(intents).length > 0) {
        let intents = request.nlu.intents;
        let response;

        if(intents.choice_event) {
            response = ChoiceEvent();
        }

        if(intents.about_event) {
            response = AboutEvent();
        }
        return response;
    }
    else {
        return fallback();
    }
};