/* ===================================================================
 * Event tables JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    // $WIN = $(window);
    var doc = document.documentElement;

    var initEventTables = function() {
        $(document).ready(function() {
            let nextConcertTable = $("#next-concert-table");
            let pastConcertTable = $("#past-concert-table");
            if(0 == nextConcertTable.length || 0 === pastConcertTable.length) {
                return;
            }
            fetch("/data/concerts.json")
            .then(function(response){
                return response.json();
            })
            .then(function(jdata){
                var jconcerts = jdata["concerts"];
                var jnextConcerts = [];
                var jpastConcerts = [];
                var today = new Date();
                jconcerts.forEach(function(obj) {
                    obj["date"] = new Date(obj["date"]);
                    if(obj["date"] < today) {
                        jpastConcerts.push(obj);
                    }
                    else {
                        jnextConcerts.push(obj);
                    }
                });
                if(0 == jnextConcerts.length) {
                    $("<p>Pas de concert à venir !</p>").insertAfter(nextConcertTable);
                    nextConcertTable.remove();
                }
                else {
                    var nextConcertsTable = new DataTable("#next-concert-table", {
                        data: jnextConcerts,
                        order: [[0, 'desc']],
                        searching: false,
                        paging: false,
                        info: false,
                        scrollX: true,
                        columns: [
                            {title: "Date", data: "date"},
                            {title: "Groupe", data: "groupe"},
                            {title: "Evenement", data: "evenement"},
                            {title: "Localisation", data: "localisation"}
                        ],
                        columnDefs: [
                            {
                                targets: 0,
                                render: DataTable.render.date("DD MMM YYYY", "fr")
                            }
                        ]
                    });
                }
                if(0 == jpastConcerts.length) {
                    $("<p>Pas de concert passé récent !</p>").insertAfter(pastConcertTable);
                    pastConcertTable.remove();
                }
                else {
                    pastConcertTable.DataTable({
                        data: jpastConcerts,
                        order: [[0, 'desc']],
                        searching: false,
                        paging: false,
                        info: false,
                        scrollX: true,
                        columns: [
                            {title: "Date", data: "date"},
                            {title: "Groupe", data: "groupe"},
                            {title: "Evenement", data: "evenement"},
                            {title: "Localisation", data: "localisation"}
                        ],
                        columnDefs: [
                            {
                                targets: 0,
                                render: DataTable.render.date("DD MMM YYYY", "fr")
                            }
                        ]
                    });
                }
            });
        });
    };

    (function ssInit() {
        initEventTables();
    })();

})(jQuery);