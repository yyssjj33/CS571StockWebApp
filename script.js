//var url =  "http://localhost/cs571/homework8/index.php";
var companyName;
function removeRow(sym){
    console.log(sym);
    $("#favoritelist table #fl"+sym).remove();
    localStorage.removeItem(sym);
}

$(document).ready(function(){
    $("#warning").html("");
     $("#favoritelist table tr").slice(1).remove();
    writeFL();
    
    $('#next-slide').prop('disabled', true);
     $('[data-toggle="tooltip"]').tooltip();  
});
$('.carousel').carousel({
    interval: false,
    wrap: false
});


function parse_quote(data){
    
    var table = '<div class="table-responsive center-block"><table class="table table-striped ">';
    companyName = data.Name;
    table += '<tr><th>'+'Name'+'</th><td>'+data.Name+'</td></tr>';
    stockSymbol = data.Symbol;
    table += '<tr><th>'+'Symbol'+'</th><td>'+data.Symbol+'</td></tr>';
    lastPrice = data.LastPrice;
    table += '<tr><th>'+'Last Price'+'</th><td>$ '+data.LastPrice+'</td></tr>';
    change = data.Change;
    changePercent = data.ChangePercent;
    if (change > 0){
        change = change.toFixed(2);
        changePercent = changePercent.toFixed(2);
        table += '<tr><th>'+'Change(Change Percent)'+'</th><td><span style="color:green">'+change+" ( "+changePercent+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/up.png"></td></tr>';
    }else if(change < 0){
        change = change.toFixed(2);
        changePercent = changePercent.toFixed(2);
        table += '<tr><th>'+'Change(Change Percent)'+'</th><td><span style="color:red">'+change+"("+changePercent+"%)"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/down.png"></td></tr>';
    }else{
        change = change.toFixed(2);
        changePercent = changePercent.toFixed(2);
         table += '<tr><th>'+'Change(Change Percent)'+'</th><td><span>'+change+"("+changePercent+"%)"+'</span></td></tr>';
    }
    var time = data.Timestamp;
   var str = moment(new Date(time)).format("DD MMMM YYYY, h:mm:ss a");
    
    table += '<tr><th>'+'Time and Date'+'</th><td>'+str+'</td></tr>';
    marketcap = data.MarketCap;
    if (Math.round(marketcap / 1000000000 ) != 0){
        marketcap = marketcap / 1000000000 ;
        marketcap = Math.round(marketcap * 100)/100;
        marketcap = marketcap + " Billion";
        table += '<tr><th>'+'Market Cap'+'</th><td>'+marketcap+'</td></tr>';
    }else if (Math.round(marketcap / 1000000 ) != 0){
        marketcap = marketcap / 1000000 ;
        marketcap = Math.round(marketcap * 100)/100;
        marketcap = marketcap + " Million";
        table += '<tr><th>'+'Market Cap'+'</th><td>'+marketcap +'</td></tr>';
    }else{
        marketcap = "None";
        table += '<tr><th>'+'Market Cap'+'</th><td>'+marketcap+'</td></tr>';
    }
    table += '<tr><th>'+'Volume'+'</th><td>'+data.Volume+'</td></tr>';
    var changePercentYTD = data.ChangePercentYTD;
    var changeYTD = data.ChangeYTD;
    if (changePercentYTD > 0){
        changeYTD = changeYTD.toFixed(2);
        changePercentYTD = changePercentYTD.toFixed(2);
        table += '<tr><th>'+'Change YTD( Change Percent YTD)'+'</th><td><span style="color:green">'+changeYTD+" ( "+changePercentYTD+"% )"+'<span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/up.png"></td></tr>';
    }else{
        changeYTD = Math.round(changeYTD * 100) / 100;
        changePercentYTD = Math.round(changePercentYTD * 100) / 100;
        table += '<tr><th>'+'Change YTD( Change Percent YTD)'+'</th><td><span style="color:red">'+changeYTD+" ( "+changePercentYTD+"% )"+'<span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/down.png"></td></tr>';
    }
    
    table += '<tr><th>'+'High Price'+'</th><td>$ '+data.High+'</td></tr>';
    table += '<tr><th>'+'Low Price'+'</th><td>$ '+data.Low+'</td></tr>';
    table += '<tr><th>'+'Opening Price'+'</th><td>$ '+data.Open+'</td></tr>';
    table +='</table></div>';
    $("#stockdetailtable").html("");
    $("#stockdetailtable").append(table);
}

function getDetails(target, url){
    $.ajax({
        url: url,
        type: 'GET',
        dataType:'json',
        data:{quote:target},
        success: function (result) {
             console.log(result);
            if(result.Message != null){
                $("#warning").html("Select a valid entry");
                return;
            }
            if(result.length != 0 && result.Status==="SUCCESS"){
                $("#warning").html("");
                parse_quote(result);         
                if(localStorage.getItem(stockSymbol)!=null){
                    $('#favoritelistbutton span').addClass("glyphicon-star-yellow");
                }else{
                     $('#favoritelistbutton span').removeClass("glyphicon-star-yellow");
                }
                $("#showpanel").carousel('next');
            }else {
                $("#stockdetailtable").html("");
                $("#stockdetailtable").append("<h4>Can't get this stock</h4>");
                return;
            }
        }
    });
}

$(function () {
    $("#quotebutton").click(function () {
//        $("#favoritelist").html("");
        $(".nav-pills li").removeClass("active");
        $(".nav-pills li:first").addClass("active");
        $(".tab-content div").removeClass("active");
        $(".tab-content #stocks").addClass("active");
        $('#next-slide').prop('disabled', false);
        

        target = $("#quote").val();
//        var url = "http://localhost/cs571/homework8/index.php?quote=" + target;
//        var url = "http://localhost/cs571/homework8/index.php";
        var url = "index.php";
//        var url = "http://newappyangji-env.us-west-2.elasticbeanstalk.com";
         charurl = "http://chart.finance.yahoo.com/t?s="+target+"&lang=en-US&width=400&height=300";
        if($("#warning").html()!=""){
            return;
        }
        if (target != "") {
        
            $("#currentchart").html("");
            $("#currentchart").append('<img  src=' + charurl+' class="img-responsive center-block " alt="stock chart"/>');
            
            getDetails(target, url);
            
            
        }
        

    });
});

$(function(){
    $('#clear').click(function(){
        $("#stockdetailtable").html("");
        $("#currentchart").html("");
        $('#quote').val("");
        $("#warning").html("");
        $('#next-slide').prop('disabled', true);
        
        $("#showpanel").carousel('prev');
    });
});

$(function() {
 
    $( "#quote" ).autocomplete({
      source: function( request, response ) {
          $("#warning").html("");
        $.ajax({
//          url: "http://localhost/cs571/homework8/index.php",
//           url: "http://newappyangji-env.us-west-2.elasticbeanstalk.com",
            url : "index.php",
          dataType: "json",
          data: {
            lookup: request.term
          },
          success: function( data ) {
              if(data.length === 0){
                  $("#warning").html("Select a valid entry");
                  $("#quote").removeClass('ui-autocomplete-loading');
                  
              }else{
                  $("#warning").html("");
                response( data );
              }
          }
        });
      },
      minLength: 1,
      select: function( event, ui ) {
        $( "#quote" ).val( ui.item.Symbol );
          return false;
      },search  : function(){$(this).addClass('ui-autocomplete-loading');},
        open    : function(){$(this).removeClass('ui-autocomplete-loading');}
    })
    .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li>" )
            .append(   item.Symbol + " - "+ item.Name + " ( "+ item.Exchange+ " ) " )
            .appendTo( ul );
         };
  });



function getNews(symbol){
    $("#news").html("");
        $.ajax({
            url: "index.php",
            type: 'GET',
            dataType: "json",
            data:{news:symbol},
            success: function (data) {
                
                console.log(data.d);

                var newspiece = "";
                for(var i = 0; i < data.d.results.length; i++){
                    var title = data.d.results[i].Title;
                    var unescapedUrl = data.d.results[i].Url;
                    var content = data.d.results[i].Description;
                    var publisher = data.d.results[i].Source;
                    var publishedDate = data.d.results[i].Date;
                    publishedDate = moment(new Date(publishedDate)).format("DD MMM YYYY, h:mm:ss");
                    newspiece = "<div class='well'>";
                    newspiece += "<h4 class='text-primary'><a target='_blank' href='"+unescapedUrl+"'>"+title+"</a></h4><br>";
                    newspiece += "<div>"+content+"</div><br>";
                    newspiece += "<div><strong>Publisher: "+publisher+"</strong></div>";
                    newspiece += "<div><strong>Date: "+publishedDate+"</strong></div>";
                    newspiece += "</div>";
                $("#news").append(newspiece);
                }
            }
        });
}
$(function(){
    $("#newstab").on('click',function(){
        getNews(stockSymbol);
    })
})

function writeFL(){
//    var url = "http://newappyangji-env.us-west-2.elasticbeanstalk.com";
            var url = "index.php";
//    var url = "http://localhost/cs571/homework8/index.php";
//    $.each(localStorage, function(key, value){
    map = new Map();
    for (var i = 0; i < localStorage.length; i++){
        var flrow = "";
        var symbol = localStorage.getItem(localStorage.key(i));
//        var symbol = localStorage.getItem(i);
        
        (function(symbol){
         $.ajax({
                url: url,
                type: 'GET',
                dataType:'json',
                data:{quote:symbol},
                success: function (result) {
                    var flSymbol = result.Symbol;
                    var flName = result.Name;
                    var flChange = result.Change;
                    var flChangePercente = result.ChangePercent;
                    var flMarketCap = result.MarketCap;
                    var flPrice = result.LastPrice;
                    flrow = "<tr id='fl"+flSymbol+"'>";
                    flrow += "<td class='text-primary'><a href='' onclick='turnTo(\""+flSymbol+"\"); return false;'>"+flSymbol+"</a></td>";
                    flrow += "<td>"+flName+"</td>";
                    flrow += "<td>$ "+flPrice+"</td>";
                    if (flChange > 0){
                        flChange = flChange.toFixed(2);
                        flChangePercente = flChangePercente.toFixed(2);
                        flrow += '<td><span style="color:green">'+flChange+" ( "+flChangePercente+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/up.png"></td>';
                    }else{ 
                        flChange = flChange.toFixed(2);
                        flChangePercente = flChangePercente.toFixed(2);
                        flrow += '<td><span style="color:red">'+flChange+" ( "+flChangePercente+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/down.png"></td>';
                    }
                    if (Math.round(flMarketCap / 1000000000 ) != 0){
                        flMarketCap = flMarketCap / 1000000000 ;
                        flMarketCap = Math.round(flMarketCap * 100)/100;
                        flMarketCap = flMarketCap + " Billion";
                        flrow += "<td>"+flMarketCap+"</td>";
                    }else if (Math.round(flMarketCap / 1000000 ) != 0){
                        flMarketCap = flMarketCap / 1000000 ;
                        flMarketCap = Math.round(flMarketCap * 100)/100;
                        flMarketCap = flMarketCap + " Million";
                        flrow += "<td>"+flMarketCap+"</td>";
                    }else{
                        flMarketCap = "None";
                        flrow += "<td>"+flMarketCap+"</td>";
                    }
                    
      
                    flrow += "<td>"+"<button onclick='removeRow("+JSON.stringify(flSymbol)+")' type='button' class='btn btn-sm btn-default'><span class='glyphicon glyphicon-trash'></span></button>"+"</td>";
                    
                    //$("#favoritelist table tr:last").after(flrow);
                    map.set(flSymbol,flrow);
                    if (map.size === localStorage.length){
                        for (var i = 0; i < localStorage.length; i++){
        
                            var symbol = localStorage.getItem(localStorage.key(i));
                            console.log(map.get(symbol));
                            $("#favoritelist table tr:last").after(map.get(symbol));
                        }
                    }
                    console.log("write "+flSymbol);
                }
            });
        })(symbol);
        
        
    };
    

}


$(function () {

    // Cycles to the previous item
    $("#prev-slide").click(function () {
        
        $("#showpanel").carousel('prev');
    });

    // Cycles to the next item
    $("#next-slide").click(function () {
        if(companyName!= ""){
        $("#showpanel").carousel('next');
        }
    });


});

function turnTo(symbol){
//    var url = "http://newappyangji-env.us-west-2.elasticbeanstalk.com";
            var url = "index.php";
    stockSymbol = symbol;
    if(localStorage.getItem(symbol)!=null){
        $('#favoritelistbutton span').addClass("glyphicon-star-yellow");
    }else{
         $('#favoritelistbutton span').removeClass("glyphicon-star-yellow");
    }
    getDetails(symbol, url);
    var newpicurl = "http://chart.finance.yahoo.com/t?s="+symbol+"&lang=en-US&width=400&height=300";
    $("#currentchart").html("");
    
    $("#currentchart").append('<img  src=' + newpicurl+' class="img-responsive center-block " alt="stock chart"/>');
    $('#charts').html("");
     new Markit.InteractiveChartApi(symbol, 1095);
    
    getNews(symbol);
    $("#showpanel").carousel('next');
}

function share() {
    var sharepicurl = "http://chart.finance.yahoo.com/t?s="+stockSymbol+"&lang=en-US&width=400&height=300";
    FB.ui({
    method: 'feed',
    picture: sharepicurl,
    name: 'Current Stock Price of '+companyName+' is $'+lastPrice,
    link: 'http://dev.markitondemand.com',
    caption: 'LAST TRADE PRCICE: $'+lastPrice+', CHANGE: '+change+' ('+changePercent+' %)',
   description: 'Stock Information of '+companyName+' ('+stockSymbol+')',

  },function(response){
      if(response.post_id){
         alert("Posted Successfully");
      }else{
          alert("Not Posted");
      }
  });
}

$(function(){
    $('#facebookfeed').click(function(){
       share();
    });
});
$(function(){
    $('#favoritelistbutton').click(function(){
        if (localStorage.getItem(stockSymbol) ==null || !$('#favoritelistbutton span').hasClass("glyphicon-star-yellow")){
            $('#favoritelistbutton span').addClass("glyphicon-star-yellow");
            localStorage.setItem(stockSymbol,stockSymbol);
            if(localStorage.length != 0){
//                $("#favoritelist table tr").slice(1).remove();
//                writeFL();
                (function(symbol){
                 $.ajax({
//                        url: "http://newappyangji-env.us-west-2.elasticbeanstalk.com",
                        url:"index.php",
                        type: 'GET',
                        dataType:'json',
                        data:{quote:symbol},
                        success: function (result) {
                            var flSymbol = result.Symbol;
                            var flName = result.Name;
                            var flChange = result.Change;
                            var flChangePercente = result.ChangePercent;
                            var flMarketCap = result.MarketCap;
                            var flPrice = result.LastPrice;
                            flrow = "<tr id='fl"+flSymbol+"'>";
                            flrow += "<td class='text-primary'><a href='' onclick='turnTo(\""+flSymbol+"\"); return false;'>"+flSymbol+"</a></td>";
                            flrow += "<td>"+flName+"</td>";
                            flrow += "<td>$ "+flPrice+"</td>";
                            if (flChange > 0){
                                flChange = flChange.toFixed(2);
                                flChangePercente = flChangePercente.toFixed(2);
                                flrow += '<td><span style="color:green">'+flChange+" ( "+flChangePercente+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/up.png"></td>';
                            }else{ 
                                flChange = flChange.toFixed(2);
                                flChangePercente = flChangePercente.toFixed(2);
                                flrow += '<td><span style="color:red">'+flChange+" ( "+flChangePercente+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/down.png"></td>';
                            }
                            if (Math.round(flMarketCap / 1000000000 ) != 0){
                                flMarketCap = flMarketCap / 1000000000 ;
                                flMarketCap = Math.round(flMarketCap * 100)/100;
                                flMarketCap = flMarketCap + " Billion";
                                flrow += "<td>"+flMarketCap+"</td>";
                            }else if (Math.round(flMarketCap / 1000000 ) != 0){
                                flMarketCap = flMarketCap / 1000000 ;
                                flMarketCap = Math.round(flMarketCap * 100)/100;
                                flMarketCap = flMarketCap + " Million";
                                flrow += "<td>"+flMarketCap+"</td>";
                            }else{
                                flMarketCap = "None";
                                flrow += "<td>"+flMarketCap+"</td>";
                            }


                            flrow += "<td>"+"<button onclick='removeRow("+JSON.stringify(flSymbol)+")' type='button' class='btn btn-sm btn-default'><span class='glyphicon glyphicon-trash'></span></button>"+"</td>";

                            $("#favoritelist table tr:last").after(flrow);
                            console.log("write "+flSymbol);
                        }
                    });
                })(stockSymbol);
            }
        }
        else {
            
            removeRow(stockSymbol);
            $('#favoritelistbutton span').removeClass("glyphicon-star-yellow");
            console.log("REMOVE " + stockSymbol);
        
        }
    })
});

function refresh(){
    for (var i = 0; i < localStorage.length; i++){
           var symbol = localStorage.getItem(localStorage.key(i));
//            var url = "http://localhost/cs571/homework8/index.php";
//            var url= "http://newappyangji-env.us-west-2.elasticbeanstalk.com";
                var url = "index.php";
        (function(s){ 
            $.ajax({
                url: url,
                type: 'GET',
                dataType:'json',
                data:{quote:s},
                success: function (result) {
                    
                    var newChange = result.Change;
                    var newChangePercente = result.ChangePercent;
                    var newPrice = result.LastPrice;
                    var newID = "fl" + result.Symbol;
                    $("#favoritelist table #"+newID+" td:eq(2)").html("$ "+JSON.stringify(newPrice));
                    console.log(s+Date()+"price");
                    if (newChange > 0){
                        newChange = newChange.toFixed(2);
                        newChangePercente = newChangePercente.toFixed(2);
                        var newRow = '<span style="color:green">'+newChange+" ( "+newChangePercente+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/up.png">';
                        $("#favoritelist table #"+newID+" td:eq(3)").html(newRow);
                    }else{ 
                        newChange = newChange.toFixed(2);
                        newChangePercente = newChangePercente.toFixed(2);
                        var newRow = '<span style="color:red">'+newChange+" ( "+newChangePercente+"% )"+'</span><img src="http://cs-server.usc.edu:45678/hw/hw8/images/down.png">';
                        $("#favoritelist table #"+newID+" td:eq(3)").html(newRow);
                        
                    }
                    console.log(s+Date()+"change");
                    
                    
                }
            });
        })(symbol);
        //console.log(symbol);
    }
}

$(function(){
   $("#refresh").click(function(){
        console.log($('#autorefresh').prop('checked'));
       
        //var url = "http://newappyangji-env.us-west-2.elasticbeanstalk.com?quote=" + target;
        refresh();    
        
   });
});



$(function() {
    $('#autorefresh').change(function() {
        if ($('#autorefresh').prop('checked')){
            check();
        }else{
            clearInterval(interval);
        }
    })
  })

function check(){
    
        console.log("open auto refresh");
        interval = setInterval(function(){refresh()}, 5000);
    
}

var Markit = {};
Markit.InteractiveChartApi = function(symbol,duration){
    this.symbol = symbol.toUpperCase();
    this.duration = duration;
    this.PlotChart();
    console.log("plot "+this.symbol);
};

Markit.InteractiveChartApi.prototype.PlotChart = function(){
    
    var params = {
        parameters: JSON.stringify( this.getInputParams() )
    }

    //Make JSON request for timeseries data
    $.ajax({
        beforeSend:function(){
            $("#chartDemoContainer").text("Loading chart...");
        },
        data: params,
        url: "http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
        dataType: "jsonp",
        context: this,
        success: function(json){
            //Catch errors
            if (!json || json.Message){
                console.error("Error: ", json.Message);
                return;
            }
            this.render(json);
        },
        error: function(response,txtStatus){
            console.log(response,txtStatus)
        }
    });
};

Markit.InteractiveChartApi.prototype.getInputParams = function(){
    return {  
        Normalized: false,
        NumberOfDays: this.duration,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: this.symbol,
                Type: "price",
                Params: ["ohlc"] //ohlc, c = close only
            },
            {
                Symbol: this.symbol,
                Type: "volume"
            }
        ]
        ,LabelPeriod: 'Week'
        //LabelInterval: 1
    }
};

Markit.InteractiveChartApi.prototype._fixDate = function(dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};

Markit.InteractiveChartApi.prototype._getOHLC = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = this._fixDate( dates[i] );
            var pointData = [
                dat,
                elements[0].DataSeries['open'].values[i],
                elements[0].DataSeries['high'].values[i],
                elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};

Markit.InteractiveChartApi.prototype._getVolume = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[1]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = this._fixDate( dates[i] );
            var pointData = [
                dat,
                elements[1].DataSeries['volume'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};

Markit.InteractiveChartApi.prototype.render = function(data) {
    //console.log(data)
    // split the data set into ohlc and volume
    var ohlc = this._getOHLC(data),
        volume = this._getVolume(data);

    // set the allowed units for data grouping
    var groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1, 2, 3, 4, 6]
    ]];

    
         $('#charts').highcharts('StockChart', {


            rangeSelector : {
                selected : 0,
                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '1w'  
                },
                {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },

            title : {
                text : this.symbol +' Stock Price'
            },
             
             yAxis: [{
            title: {
                text: 'Stock Value'
            },
            min: 0, 
            height: 200,
            lineWidth: 2,
                 tickAmount: 5,
            }],

            series : [{
                name : this.symbol,
                data : ohlc,
                type : 'area',
                threshold : null,
                tooltip : {
                    valueDecimals : 2
                },
                fillColor : {
                    linearGradient : {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops : [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }]
        });
};

$(function(){
    $("#graphtab").on('click',function(){
     $('#charts').html("");
     new Markit.InteractiveChartApi(stockSymbol, 1095);
    });
})
