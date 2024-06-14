class MyMap {
    constructor(
        options = {
            container: "map", //контейнер карты, указатель на идентификатор
            points: {}, //отметки на карте
            cluster: false, //кластеризация карты
            center: [37.588144, 55.733842], //центр карты
            zoom: 10, // приближение 1-12
            behaviors: [], // события 'drag', 'scrollZoom', 'pinchZoom', 'dblClick'
            styles: {}, //настройка стилей
        }
    ) {
        this.points = options.points || {};
        this.cluster = options.cluster || false;
        this.center = options.center || [37.588144, 55.733842];
        this.zoom = options.zoom || 10;
        this.behaviors = options.behaviors || [];
        this.styles = options.styles || {};
        this.container = options.container;
    }

    async Init() {
        await this.InitCore();
        this.InitMap();
        this.SetSchema();
        this.SetTools();
        this.SetMarkers();
    }

    async InitCore() {
        //асинхронный метод
        await ymaps3.ready; //ожтдание подключения ядра карт
        const { 
            YMap, 
            YMapDefaultSchemeLayer, 
            YMapFeatureDataSource,
            YMapControls,
            YMapMarker, 
        } = ymaps3;
        const { YMapZoomControl } = await ymaps3.import(
            "@yandex/ymaps3-controls@0.0.1"
        );

        this.ymap = YMap;
        this.ymapDefaultSchemeLayer = YMapDefaultSchemeLayer;
        this.ymapControls = YMapControls;
        this.ymapZoomControl = YMapZoomControl;
        this.ymapMarker = YMapMarker;
        this.ymapFeatureDataSorce = YMapFeatureDataSource;
    }

    InitMap() {
        let _this = this;
        _this.obMap = document.getElementById(_this.container);

        _this.map = new _this.ymap(
            // Передаём ссылку на HTMLElement контейнера
            _this.obMap,

            // Передаём параметры инициализации карты
            {
                location: {
                    center: _this.center, // Координаты центра картs
                    zoom: _this.zoom, // Уровень масштабирования
                },
                behaviors: _this.behaviors,
            }
        );
    }

    SetSchema() {
        const layer = new this.ymapDefaultSchemeLayer({
            customization: [
                // Делаем прозрачными все геометрии водных объектов.
                {
                    tags: {
                        all: ["water"],
                    },
                    elements: "geometry",
                    stylers: [
                        {
                            opacity: 0,
                        },
                    ],
                },
                // Меняем цвет подписей для всех POI и узлов сети общественного транспорта.
                {
                    tags: {
                        any: ["poi", "transit_location"],
                    },
                    elements: "label.text.fill",
                    stylers: [
                        {
                            color: "#0000DD",
                        },
                    ],
                },
            ],
        });
        this.map.addChild(layer);
    }

    SetTools() {
        this.map.addChild(
            new this.ymapControls({ position: "right" }).addChild(
                new this.ymapZoomControl({})
            )
        );
    }

    SetMarkers() {
        // map.addChild(new YMapMarker({
        //     coordinates: [37, 55],
        //     draggable: true
        // }, content));

        
        if (Object.keys(this.points).length > 0) {
            for (let i in this.points) {
                let point = this.points[i];
                console.log(this);
                this.map.addChild(
                    new this.ymapMarker(
                        {
                            coordinates: point.coords,
                            draggable: point.draggable || false,
                        },
                        point.content || ''
                    )
                );
            }
        }
    }
}

const map = new MyMap({ 
    container: "map",
    points: {
        1: {coords: [37,55], content: 'test'},
        2: {coords: [37,56], content: 'test2'}
    }
 });
map.Init();
